import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { PoolOwner } from "../../../generated/schema";
import { createOrLoadAccount } from "../account";

export function getPoolOwnerId(
  poolOwnerAddress: Address,
  idoPoolAddress: Address
): Bytes {
  return changetype<Bytes>(
    idoPoolAddress.toHexString() + poolOwnerAddress.toHexString()
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
    const account = createOrLoadAccount(changetype<Bytes>(poolOwnerAddress));
    poolOwner.account = account.id;
    poolOwner.idoPool = changetype<Bytes>(idoPoolAddress);
    poolOwner.raised = new BigInt(0);
    poolOwner.save();
  }

  log.info("Loading pool owner: {}", [
    poolOwnerAddress.toHexString(),
    poolOwner.raised.toHexString(),
  ]);
  return poolOwner;
}
