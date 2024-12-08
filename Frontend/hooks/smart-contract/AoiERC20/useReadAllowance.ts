// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { useEffect } from "react";
import { TransactionReceipt } from "viem";
import { useReadContract } from "wagmi";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  ownerAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useReadAllowance = ({
  chainId,
  ownerAddress,
  tokenAddress,
  spenderAddress,
  enabled,
}: Props) => {
  const isEnabled =
    (!!spenderAddress && !!spenderAddress && !!enabled) || !!chainId;

  const {
    data: allowance,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch: refetchAllowance,
    error
  } = useReadContract({
    chainId,
    address: enabled ? tokenAddress : undefined,
    args: isEnabled ? [ownerAddress, spenderAddress] : undefined,
    abi: getABI("AoiERC20"),
    functionName: "allowance",
    query: { enabled: isEnabled },
  });

  const refetch = enabled ? refetchAllowance : undefined;

  return {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    allowance,
    refetch
  };
};
