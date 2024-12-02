import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PoolOwner } from "../../../generated/schema";
import { createOrLoadAccount } from "../account";
import { getIDOPoolId } from "../ido";

export function getPoolOwnerId(
  poolOwnerAddress: Address,
  idoPoolAddress: Address
): Bytes {
  return Bytes.fromHexString(poolOwnerAddress.toHexString()).concat(
    Bytes.fromHexString(idoPoolAddress.toHexString())
  );
}

export function createOrLoadPoolOwner(
  poolOwnerAddress: Address,
  idoPoolAddress: Address
): PoolOwner {
  const poolOwnerId = getPoolOwnerId(poolOwnerAddress, idoPoolAddress);
  let poolOwner = PoolOwner.load(poolOwnerId);
  if (poolOwner == null) {
    poolOwner = new PoolOwner(poolOwnerId);
    const account = createOrLoadAccount(poolOwnerAddress);
    poolOwner.account = account.id;
    poolOwner.idoPool = getIDOPoolId(idoPoolAddress);
    poolOwner.raised = new BigInt(0);
    poolOwner.save();
  }

  log.info("Loading pool owner: {}", [
    poolOwnerAddress.toHexString(),
    poolOwner.raised.toHexString(),
  ]);
  return poolOwner;
}
