import { Address, log } from "@graphprotocol/graph-ts";
import { IDOPool, Investor, PoolOwner } from "../../generated/schema";
import {
  CanceledPrivatePoolRegistration as CanceledPrivatePoolRegistrationEvent,
  IDOPoolClaimed as IDOPoolClaimedEvent,
  IDOPoolInvested as IDOPoolInvestedEvent,
  IDOPoolInvestmentCanceled as IDOPoolInvestmentCanceledEvent,
  IDOPoolListed as IDOPoolListedEvent,
  IDOPoolRefunded as IDOPoolRefundedEvent,
  IDOPoolWithdrawn as IDOPoolWithdrawnEvent,
  RegisteredPrivatePool as RegisteredPrivatePoolEvent,
} from "../../generated/templates/IDOPool/IDOPool";
import { getIDOPoolDetail, getIDOPoolId } from "../module/ido";
import { createOrLoadInvestor, getInvestorId } from "../module/investor";
import { createInvestorActivity } from "../module/activity";
import * as activityTypes from "../module/activity/type";
import * as idoPoolTypes from "../module/ido/type";
import { trackActivity } from "../module/analytics";
import { buildLiquidityPoolFromIDOPool } from "../module/liquidityPool";

export function handleIDOPoolInvested(event: IDOPoolInvestedEvent): void {
  const amount = event.params.amount;
  const investorAddress = event.params.investor;
  const idoPoolAddress = event.address;
  const idoPoolId = getIDOPoolId(idoPoolAddress);
  const idoPoolDetail = getIDOPoolDetail(idoPoolAddress);
  if (idoPoolDetail.tokenAddress.equals(Address.zero())) {
    return;
  }
  let idoPool = IDOPool.load(idoPoolId);
  if (idoPool == null) {
    return;
  }
  const expectedRaisingAmount = idoPool.raisedAmount.plus(amount);
  if (expectedRaisingAmount.notEqual(idoPoolDetail.raisedAmount)) {
    log.warning(
      "The invested amount of investor {} is {} not equal to the expected raising amount {}",
      [
        investorAddress.toHexString(),
        amount.toHexString(),
        expectedRaisingAmount.toHexString(),
      ]
    );
  }
  idoPool.raisedAmount = idoPool.raisedAmount.plus(amount);
  idoPool.raisedTokenAmount = idoPoolDetail.raisedTokenAmount;
  idoPool.save();

  // Build Count metric
  const investor = createOrLoadInvestor(investorAddress, idoPoolAddress);
  let investorActivity = createInvestorActivity(
    investor,
    activityTypes.ActivityType.INVEST,
    amount,
    event.block.timestamp
  );
  investorActivity.transactionHash = event.transaction.hash;
  investorActivity.investor = investor.id;
  investorActivity.idoPool = idoPool.id;
  investorActivity.save();

  // Track analytics
  trackActivity(investorActivity, idoPool.id, event.block.timestamp);
}

export function handleIDOPooInvestmentCanceled(
  event: IDOPoolInvestmentCanceledEvent
): void {
  const investorAddress = event.params.investor;
  const amount = event.params.amount;
  const idoPoolAddress = event.address;
  const idoPoolDetail = getIDOPoolDetail(idoPoolAddress);
  if (idoPoolDetail.tokenAddress.equals(Address.zero())) {
    return;
  }
  const idoPoolId = getIDOPoolId(idoPoolAddress);
  let idoPool = IDOPool.load(idoPoolId);
  if (idoPool == null) {
    return;
  }
  idoPool.raisedAmount = idoPoolDetail.raisedAmount;
  idoPool.raisedTokenAmount = idoPoolDetail.raisedTokenAmount;
  idoPool.save();

  // Build count metric
  const investor = createOrLoadInvestor(investorAddress, idoPoolAddress);
  let investorActivity = createInvestorActivity(
    investor,
    activityTypes.ActivityType.CANCEL_INVESTMENT,
    amount,
    event.block.timestamp
  );
  investorActivity.transactionHash = event.transaction.hash;
  investorActivity.investor = investor.id;
  investorActivity.idoPool = idoPool.id;
  investorActivity.save();

  // Track analytics
  trackActivity(investorActivity, idoPoolId, event.block.timestamp);
}

export function handleIDOPoolWithdrawn(event: IDOPoolWithdrawnEvent): void {
  const ethAmount = event.params.ethAmount;

  const idoPoolAddress = event.address;
  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }

  let poolOwner = PoolOwner.load(idoPool.poolOwner);
  if (poolOwner == null) {
    log.warning("poolOwner of idoPool {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  poolOwner.raised = ethAmount;
  poolOwner.save();
}

export function handleIDOPoolClaimed(event: IDOPoolClaimedEvent): void {
  const investorAddress = event.params.investor;
  const claimAmount = event.params.amount;

  const idoPoolAddress = event.address;
  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }

  let investor = createOrLoadInvestor(investorAddress, idoPoolAddress);
  // Activity
  let investorActivity = createInvestorActivity(
    investor,
    activityTypes.ActivityType.CLAIM,
    claimAmount,
    event.block.timestamp
  );
  investorActivity.transactionHash = event.transaction.hash;
  investorActivity.investor = investor.id;
  investorActivity.idoPool = idoPool.id;
  investorActivity.save();
}

export function handleIDOPoolListed(event: IDOPoolListedEvent): void {
  const liquidityPoolAddress = event.params.liquidityPool;
  const idoPoolAddress = event.address;
  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  let liquidityPool = buildLiquidityPoolFromIDOPool(idoPool);
  liquidityPool.liquidityPoolAddress = liquidityPoolAddress;
  liquidityPool.createdTime = event.block.timestamp;
  liquidityPool.save();

  let poolOwner = PoolOwner.load(idoPool.poolOwner);
  if (poolOwner == null) {
    log.warning("poolOwner of idoPool {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  poolOwner.listingTransactionHash = event.transaction.hash;
  poolOwner.raised = idoPool.raisedAmount;
  poolOwner.save();

  // Track successfully
}

export function handleIDOPoolRefunded(event: IDOPoolRefundedEvent): void {
  const idoPoolAddress = event.address;
  const investorAddress = event.params.investor;
  const amount = event.params.amount;

  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  let investor = Investor.load(getInvestorId(investorAddress, idoPoolAddress));
  if (investor == null) {
    log.warning("investor of idoPool {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  investor.claimed = true;
  investor.save();

  let investorActivity = createInvestorActivity(
    investor,
    activityTypes.ActivityType.REFUND,
    amount,
    event.block.timestamp
  );

  // Track
  trackActivity(investorActivity, idoPool.id, event.block.timestamp);
}

export function handleRegisteredPrivatePool(
  event: RegisteredPrivatePoolEvent
): void {
  const idoPoolAddress = event.address;
  const investorAddress = event.params.investor;

  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }
  if (idoPool.idoType == idoPoolTypes.PUBLIC_SALE) {
    log.warning("idoPool with address {} is public", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }

  let investor = createOrLoadInvestor(investorAddress, idoPoolAddress);
  investor.registered = true;
  investor.save();
}

export function handleCanceledPrivatePoolRegistration(
  event: CanceledPrivatePoolRegistrationEvent
): void {
  const idoPoolAddress = event.address;
  const investorAddress = event.params.investor;

  let idoPool = IDOPool.load(getIDOPoolId(idoPoolAddress));
  if (idoPool == null) {
    log.warning("idoPool with address {} do not exist.", [
      idoPoolAddress.toHexString(),
    ]);
    return;
  }

  let investor = createOrLoadInvestor(investorAddress, idoPoolAddress);
  if (!investor.registered) {
    log.warning("investor with address {} did not register", [
      investorAddress.toHexString(),
    ]);
    return;
  }
  investor.registered = false;
  investor.save();
}
