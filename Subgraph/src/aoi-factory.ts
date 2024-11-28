import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent
} from "../generated/AoiFactory/AoiFactory"
import { OwnershipTransferred, PoolCreated } from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.tokenAddress = event.params.tokenAddress
  entity.poolId = event.params.poolId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
