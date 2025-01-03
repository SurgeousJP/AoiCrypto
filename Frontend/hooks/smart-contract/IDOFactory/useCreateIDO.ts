// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { getIDOFactoryAddress } from "@/contracts/utils/getAddress.util";
import { decodeErrorResult, TransactionReceipt } from "viem";
import {
  useSimulateContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWriteContractCallbacks } from "@/hooks/smart-contract/useWriteContractCallbacks";
import { CreateIDOInput } from "@/contracts/types/IDO/CreateIDOInput";
import { useEffect } from "react";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  idoInput: CreateIDOInput;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useCreateIDO = ({
  chainId,
  idoInput,
  enabled,
  onSuccess,
  onSettled,
  onError,
}: Props) => {
  const {
    data: config,
    refetch,
    isLoading: isLoadingPrepare,
    isError: isErrorPrepare,
    error: errorPrepare,
  } = useSimulateContract({
    chainId,
    address: getIDOFactoryAddress(chainId),
    abi: getABI("IDOFactory"),
    // <---! PARAMS IN ABI !---> //
    args: [
      idoInput.poolDetails,
      idoInput.poolTime,
      idoInput.privateSale,
      idoInput.whitelisted,
      idoInput.action,
      idoInput.lockExpired,
    ],
    // <---! PARAMS IN ABI !---> //

    // <---! FUNCTION IN ABI !---> //
    functionName: "createPool",
    // <---! FUNCTION IN ABI !---> //
    query: { enabled: enabled && !!chainId, retry: false },
    value: idoInput.poolDetails.liquidityWETH9
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
        console.log("Create IDO confirmed");
        onSuccess?.(data);
      } else {
        console.log("IDO creation transaction received, awaiting confirmation");
      }
    },
    onSettled: (data?: TransactionReceipt, isConfirmed?: boolean) => {
      if (isConfirmed) {
        console.log("IDO creation process completed");
        onSettled?.(data);
      }
    },
    onError,
    error: errorWrite,
  });

  const onCreateIDO = async () => {
    console.log("Config: ", config);
    console.log("Enabled: ", enabled);
    if (config && enabled) {
      try {
        return await writeContractAsync(config.request);
      } catch (error) {
        onError?.(
          errorWrite instanceof Error
            ? errorWrite
            : new Error("Something went wrong in onCreateIDO async function")
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
    console.log("Error simulating contract create IDO: ", errorPrepare);
    if (config) console.log("Data: ", config);
  }, [errorPrepare, config]);
    
  return {
    config,
    error,
    errorWrite,
    isLoading,
    isSuccess,
    isSuccessConfirmation,
    isError,
    onCreateIDO,
    refetch,
  };
};
