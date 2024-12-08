// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { TransactionReceipt } from "viem";
import {
  useSimulateContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWriteContractCallbacks } from "@/hooks/smart-contract/useWriteContractCallbacks";
import { useEffect } from "react";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  tokenAddress: `0x${string}`,
  spenderAddress: `0x${string}`,
  numOfTokensAllowed: bigint,
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useApproveSender = ({
  chainId,
  tokenAddress,
  spenderAddress,
  numOfTokensAllowed,
  enabled,
  onSuccess,
  onSettled,
  onError,
}: Props) => {
  const CONTRACT_LABEL = "Approve sender";
  const FUNCTION_EXECUTION_NAME = "onApproveSender";

  const {
    data: config,
    refetch,
    isLoading: isLoadingPrepare,
    isError: isErrorPrepare,
    error: errorPrepare,
  } = useSimulateContract({
    chainId,
    address: tokenAddress,
    abi: getABI("AoiERC20"),
    // <---! PARAMS IN ABI !---> //
    args: [
      spenderAddress,
      numOfTokensAllowed
    ],
    // <---! PARAMS IN ABI !---> //
    // <---! FUNCTION IN ABI !---> //
    functionName: "approve",
    // <---! FUNCTION IN ABI !---> //
    query: { enabled: enabled && !!chainId, retry: false },
  });

  const {
    writeContractAsync,
    data: transactionHash,
    isPending: isLoadingWrite,
    isError: isErrorWrite,
    error: errorWrite,
  } = useWriteContract();

  const {
    isFetching: isFetchingReceipt,
    isLoading: isLoadingReceipt,
    data: receipt,
    isFetched,
    isSuccess,
    isError: isErrorReceipt,
    error: errorTransaction,
  } = useWaitForTransactionReceipt({
    hash: transactionHash,
    query: {
      enabled,
    },
  });

  const {
    isFetching: isFetchingConfirmation,
    isLoading: isLoadingConfirmation,
    isFetched: isFetchedConfirmation,
    isSuccess: isSuccessConfirmation,
    isError: isErrorConfirmation,
    error: errorConfirmation,
  } = useTransactionConfirmations({
    hash: transactionHash,
    query: {
      enabled,
    },
  });

  useWriteContractCallbacks({
    receipt,
    isFetched,
    isFetchedConfirmation,
    isSuccessConfirmation,
    onSuccess: (data: TransactionReceipt, isConfirmed: boolean) => {
      if (isConfirmed) {
        console.log(`${CONTRACT_LABEL} confirmed`);
        onSuccess?.(data);
      } else {
        console.log(`${CONTRACT_LABEL} transaction received, awaiting confirmation`);
      }
    },
    onSettled: (data?: TransactionReceipt, isConfirmed?: boolean) => {
      if (isConfirmed) {
        console.log(`${CONTRACT_LABEL} process completed`);
        onSettled?.(data);
      }
    },
    onError,
    error: errorWrite,
  });

  const onApproveSender = async () => {
    console.log("Approve spender triggered: ");
    console.log("Config: ", config);
    console.log("Enabled: ", enabled);
    if (config && enabled) {
      try {
        return await writeContractAsync(config.request);
      } catch (error) {
        onError?.(
          errorWrite instanceof Error
            ? errorWrite
            : new Error(`Something went wrong in ${FUNCTION_EXECUTION_NAME} async function`)
        );
      }
    }
    return;
  };

  const isLoading =
    isLoadingReceipt ||
    isLoadingConfirmation ||
    isLoadingPrepare ||
    isLoadingWrite ||
    isFetchingReceipt ||
    isFetchingConfirmation;

  const isError =
    isErrorPrepare || isErrorReceipt || isErrorWrite || isErrorConfirmation;

  const error =
    errorWrite || errorTransaction || errorPrepare || errorConfirmation;

  useEffect(() => {
    console.log("Error simulating approve spender: ", errorPrepare);
  }, [errorPrepare]);

  return {
    error,
    errorWrite,
    isLoading,
    isSuccess,
    isSuccessConfirmation,
    isError,
    onApproveSender,
    refetch,
  };
};
