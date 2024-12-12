// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { useEffect } from "react";
import { TransactionReceipt } from "viem";
import { useReadContract } from "wagmi";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  poolAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useCheckRegisteredPrivatePool = ({
  chainId,
  poolAddress,
  spenderAddress,
  enabled,
}: Props) => {
  const isEnabled =
    (!!poolAddress && !!spenderAddress && !!enabled) || !!chainId;

  console.log("Is enabled: ", isEnabled);
  console.log("Pool address: ", poolAddress);
  const {
    data: isRegistered,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchAllowance,
    error
  } = useReadContract({
    chainId,
    address: enabled ? poolAddress : undefined,
    args: isEnabled ? [spenderAddress] : undefined,
    abi: getABI("IDOPool"),
    functionName: "isRegistered",
    query: { enabled: isEnabled },
  });

  const refetch = enabled ? refetchAllowance : undefined;

  return {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    isRegistered,
    refetch
  };
};