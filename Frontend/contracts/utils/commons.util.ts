import { IDOFactory } from "@/contracts/abis/IDOFactory.abi";
import { ERC20Factory } from "@/contracts/abis/ERC20Factory.abi";
import { AoiERC20 } from "@/contracts/abis/AoiERC20.abi";
import { IDOPool } from "../abis/IDOPool.abi";

export const SMART_CONTRACT_ADDRESS = {
  IDOFactory: {
    11155111: "0x12De8e7C39EE62282Af548F1a1E4128101567837"
  },
  // 0x287240Be56BDb74A9fb6a6507db3152e69e620F8
  ERC20Factory: {
    11155111: "0xBB64692b13dE29e0f5370FBF476E471E6084d080"
  },
}

export const ABI_CONTRACT = {
  IDOFactory: IDOFactory,
  ERC20Factory: ERC20Factory,
  AoiERC20: AoiERC20,
  IDOPool: IDOPool
}

export const EXPLORER_URL = {
  11155111: "https://sepolia.etherscan.io",
}