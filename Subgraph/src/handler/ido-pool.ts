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

export function handleIDOPoolInvested(event: IDOPoolInvestedEvent): void {}

export function handleIDOPooInvestmentCanceled(
  event: IDOPoolInvestmentCanceledEvent
): void {}

export function handleIDOPoolWithdrawn(event: IDOPoolWithdrawnEvent): void {}

export function handleIDOPoolClaimed(event: IDOPoolClaimedEvent): void {}

export function handleIDOPoolListed(event: IDOPoolListedEvent): void {}

export function handleIDOPoolRefunded(event: IDOPoolRefundedEvent): void {}

export function handleRegisteredPrivatePool(
  event: RegisteredPrivatePoolEvent
): void {}

export function handleCanceledPrivatePoolRegistration(
  event: CanceledPrivatePoolRegistrationEvent
): void {}
