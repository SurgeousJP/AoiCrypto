import { Address } from "@graphprotocol/graph-ts";
import { IDOFactory } from "../../../generated/IDOFactory/IDOFactory";
import { IDOPool as IDOPoolDataSource } from "../../../generated/templates/IDOPool/IDOPool";
import * as addresses from "./addresses";

export const idoFactoryContract = IDOFactory.bind(addresses.idoFactoryAddress);

export function getIDOPoolContract(idoPoolAddress: Address): IDOPoolDataSource {
  return IDOPoolDataSource.bind(idoPoolAddress);
}
