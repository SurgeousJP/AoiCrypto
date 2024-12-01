import { keccak256, stringToHex, toHex } from "viem";
import { IDOFactoryABI } from "@/contracts/abis/IDOFactory.abi";
import { ERC20Factory } from "@/contracts/abis/ERC20Factory.abi";
import { IDOPool } from "@/contracts/abis/IDOPool.abi";

export const SMART_CONTRACT_ADDRESS = {
  IDOFactory: {
    11155111: "0x30B5aCF87E1E4b8a23F64270B86Aee7B416E2130"
  },
  ERC20Factory: {
    11155111: "0xBB64692b13dE29e0f5370FBF476E471E6084d080"
  },
  IDOPool: {
    11155111: "N/A"
  }
}

export const ABI_CONTRACT = {
  IDOFactory: IDOFactoryABI,
  ERC20Factory: ERC20Factory
}

export const EXPLORER_URL = {
  11155111: "https://sepolia.etherscan.io",
}