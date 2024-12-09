// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { useEffect } from "react";
import { TransactionReceipt } from "viem";
import { useReadContract } from "wagmi";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useReadTokenBalance = ({
  chainId,
  tokenAddress,
  ownerAddress,
  enabled,
}: Props) => {
  const {
    data: balance,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchBalance,
    error
  } = useReadContract({
    chainId,
    address: tokenAddress,
    args: [ownerAddress],
    abi: getABI("AoiERC20"),
    functionName: "balanceOf",
    query: { enabled: enabled && !!chainId},
  });

  const refetch = enabled ? refetchBalance : undefined;

  useEffect(() => {
    console.log("Error get balance of token: ", error);
  }, [error]);

  return {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    balance,
    refetch
  };
};
