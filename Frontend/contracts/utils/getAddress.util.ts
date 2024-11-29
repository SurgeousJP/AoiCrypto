import {SMART_CONTRACT_ADDRESS} from "@/contracts/utils/commons.util";

export const getContractAddress = (contractName: any, networkId: any): `0x${string}` => {
  return contractName[networkId];
}

export const getIDOFactoryAddress = (networkId: any) : `0x${string}` => {
  return getContractAddress(SMART_CONTRACT_ADDRESS.IDOFactory, networkId);
}