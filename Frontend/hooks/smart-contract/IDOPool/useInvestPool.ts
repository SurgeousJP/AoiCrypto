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
  proof: string[];
  poolAddress: `0x${string}`;
  investETHAmount: bigint;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useInvestPool = ({
  chainId,
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  proof,
  poolAddress,
  investETHAmount,
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  enabled,
  onSuccess,
  onSettled,
  onError,
}: Props) => {

  const CONTRACT_LABEL = "Invest Pool";
  const FUNCTION_EXECUTION_NAME = "onInvestPool";

  const {
    data: config,
    refetch,
    isLoading: isLoadingPrepare,
    isError: isErrorPrepare,
    error: errorPrepare,
  } = useSimulateContract({
    chainId,
    address: poolAddress,
    abi: getABI("IDOPool"),
    // <---! PARAMS IN ABI !---> //
    args: [ proof ],
    // <---! PARAMS IN ABI !---> //
    // <---! FUNCTION IN ABI !---> //
    functionName: "investPool",
    // <---! FUNCTION IN ABI !---> //
    query: { enabled: enabled && !!chainId, retry: false },
    value: investETHAmount
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

  const onInvestPool = async () => {
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
    console.log("Error invest pool hook: ", error);
  }, [error]);
    
  return {
    error,
    errorPrepare,
    errorWrite,
    isLoading,
    isSuccess,
    isSuccessConfirmation,
    isError,
    onInvestPool,
    refetch,
  };
};
