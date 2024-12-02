import { Address, Bytes } from "@graphprotocol/graph-ts";
import * as addresses from "../../data/addresses";

export const idoFactoryAddress: Address = Address.fromBytes(
  Bytes.fromHexString(addresses.IDOFactory)
);

export const wethAddress: Address = Address.fromBytes(
  Bytes.fromHexString(addresses.WETH)
);

export const erc20FactoryAddress: Address = Address.fromBytes(
  Bytes.fromHexString(addresses.ERC20Factory)
);
