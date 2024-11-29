import { ABI_CONTRACT } from "@/contracts/utils/commons.util";
import { Abi } from "viem";

export default function getABI (contractName: string): Abi{
  return (ABI_CONTRACT as any)[contractName] as Abi;
}