import { IDOFactory } from "@/contracts/abis/IDOFactory.abi";
import { ERC20Factory } from "@/contracts/abis/ERC20Factory.abi";
import { AoiERC20 } from "../abis/AoiERC20.abi";

export const SMART_CONTRACT_ADDRESS = {
  IDOFactory: {
    11155111: "0x0Fa043F95487c58d1883A1A1965edaaD004Dc063"
  },
  ERC20Factory: {
    11155111: "0xBB64692b13dE29e0f5370FBF476E471E6084d080"
  },
}

export const ABI_CONTRACT = {
  IDOFactory: IDOFactory,
  ERC20Factory: ERC20Factory,
  AoiERC20: AoiERC20
}

export const EXPLORER_URL = {
  11155111: "https://sepolia.etherscan.io",
}