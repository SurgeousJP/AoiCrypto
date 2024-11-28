import { Address } from "@graphprotocol/graph-ts";
import * as addresses from "../../data/addresses";

export const idoFactoryAddress: Address = Address.fromHexString(
  addresses.IDOFactory
);

export const wethAddress: Address = Address.fromHexString(addresses.WETH);
