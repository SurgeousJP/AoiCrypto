import { keccak256, stringToHex, toHex } from "viem";
import { IDOFactoryABI } from "@/contracts/abis/IDOFactory.abi";

export const SMART_CONTRACT_ADDRESS = {
  IDOFactory: {
    11155111: "0x632a2Dca9A3Bb02Fde69C152A81160d54e38c130"
  }
}

export const ABI_CONTRACT = {
  IDOFactory: IDOFactoryABI
}

export const EXPLORER_URL = {
  11155111: "https://sepolia.etherscan.io",
}