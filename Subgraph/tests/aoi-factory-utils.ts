import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  PoolCreated
} from "../generated/AoiFactory/AoiFactory"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolCreatedEvent(
  owner: Address,
  tokenAddress: Address,
  poolId: BigInt
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )

  return poolCreatedEvent
}
