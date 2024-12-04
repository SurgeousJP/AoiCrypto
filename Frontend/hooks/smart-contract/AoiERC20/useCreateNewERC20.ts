// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import {
  getERC20FactoryAddress,
  getIDOFactoryAddress,
} from "@/contracts/utils/getAddress.util";
import { TransactionReceipt } from "viem";
import {
  useSimulateContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWriteContractCallbacks } from "@/hooks/smart-contract/useWriteContractCallbacks";
import { CreateNewERC20Input } from "@/contracts/types/ERC20/CreateNewERC20Input";
import { useEffect } from "react";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  newERC20: CreateNewERC20Input;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useCreateNewERC20 = ({
  chainId,
  newERC20,
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
    address: getERC20FactoryAddress(chainId),
    abi: getABI("ERC20Factory"),
    // <---! PARAMS IN ABI !---> //
    args: [
      newERC20.name,
      newERC20.symbol,
      newERC20.maxTotalSupply,
      newERC20.initialSupply,
    ],
    // <---! PARAMS IN ABI !---> //

    // <---! FUNCTION IN ABI !---> //
    functionName: "createNewERC20",
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
        console.log("Create new ERC20 confirmed");
        onSuccess?.(data);
      } else {
        console.log(
          "ERC20 creation transaction received, awaiting confirmation"
        );
      }
    },
    onSettled: (data?: TransactionReceipt, isConfirmed?: boolean) => {
      if (isConfirmed) {
        console.log("ERC20 creation process completed");
        onSettled?.(data);
      }
    },
    onError,
    error: errorWrite,
  });

  const onCreateNewERC20 = async () => {
    console.log("Crate new ERC20 triggered: ");
    console.log("Config: ", config);
    console.log("Enabled: ", enabled);
    if (config && enabled) {
      try {
        return await writeContractAsync(config.request);
      } catch (error) {
        onError?.(
          errorWrite instanceof Error
            ? errorWrite
            : new Error(
                "Something went wrong in onCreateNewERC20 async function"
              )
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
    // Log all errors when they change
    if (errorPrepare) {
      console.log("Error in prepareContractWrite:", errorPrepare.message);
    }
    if (errorWrite) {
      console.log("Error in contractWrite:", errorWrite.message);
    }
    if (errorTransaction) {
      console.log("Error in transaction:", errorTransaction.message);
    }
    if (errorConfirmation) {
      console.log("Error in confirmation:", errorConfirmation.message);
    }
  }, [errorPrepare, errorWrite, errorTransaction, errorConfirmation]);

  return {
    error,
    errorWrite,
    isLoading,
    isSuccess,
    isSuccessConfirmation,
    isError,
    onCreateNewERC20,
    refetch,
  };
};
