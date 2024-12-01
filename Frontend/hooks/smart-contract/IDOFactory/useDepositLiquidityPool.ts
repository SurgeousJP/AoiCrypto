// <---! IMPORT !---> //
import getABI from "@/contracts/utils/getAbi.util";
import { getIDOFactoryAddress } from "@/contracts/utils/getAddress.util";
import { TransactionReceipt } from "viem";
import {
  useSimulateContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useWriteContractCallbacks } from "@/hooks/smart-contract/useWriteContractCallbacks";
// <---! IMPORT !---> //

type Props = {
  chainId?: number;
  // <---! CONTRACT PROPS IN ABI STARTS HERE !---> //
  poolId: bigint;
  // <---! CONTRACT PROPS IN ABI ENDS HERE !---> //
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
};

export const useDepositLiquidityPool = ({
  chainId,
  poolId,
  enabled,
  onSuccess,
  onSettled,
  onError,
}: Props) => {

  const CONTRACT_LABEL = "Deposit liquidity";
  const FUNCTION_EXECUTION_NAME = "onDepositLiquidityPool";

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
    args: [ poolId ],
    // <---! PARAMS IN ABI !---> //

    // <---! FUNCTION IN ABI !---> //
    functionName: "depositLiquidityPool",
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

  const onDepositLiquidityPool = async () => {
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
    
  return {
    error,
    isLoading,
    isSuccess,
    isSuccessConfirmation,
    isError,
    onDepositLiquidityPool,
    refetch,
  };
};
