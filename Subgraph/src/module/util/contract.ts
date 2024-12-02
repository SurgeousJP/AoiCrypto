import { Address } from "@graphprotocol/graph-ts";
import { IDOFactory } from "../../../generated/IDOFactory/IDOFactory";
import { IDOPool as IDOPoolDataSource } from "../../../generated/templates/IDOPool/IDOPool";
import * as addresses from "./addresses";
import { ERC20Factory } from "../../../generated/ERC20Factory/ERC20Factory";

export const idoFactoryContract = IDOFactory.bind(addresses.idoFactoryAddress);

export const erc20FactoryContract = ERC20Factory.bind(
  addresses.erc20FactoryAddress
);

export function getIDOPoolContract(idoPoolAddress: Address): IDOPoolDataSource {
  return IDOPoolDataSource.bind(idoPoolAddress);
}
