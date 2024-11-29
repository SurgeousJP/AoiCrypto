// Import
import { WriteContractErrorType } from "viem";
import { useEffect, useRef } from "react";
import { TransactionReceipt } from "viem";
import { Config } from "wagmi";
import { WaitForTransactionReceiptData } from "wagmi/query";
// Import

type Props = {
  receipt?: WaitForTransactionReceiptData<Config, any>;
  isFetched?: boolean;
  isFetchedConfirmation?: boolean;
  isSuccessConfirmation?: boolean;
  onSuccess?: (data: TransactionReceipt, isConfirmed: boolean) => void;
  onSettled?: (data: TransactionReceipt, isConfirmed?: boolean) => void;
  onError?: (error?: Error) => void;
  error: WriteContractErrorType | null;
};

export const useWriteContractCallbacks = ({
  receipt,
  isFetched,
  isFetchedConfirmation,
  isSuccessConfirmation,
  onSuccess,
  onSettled,
  onError,
  error,
}: Props) => {
  // useRef => persists state across renders, without triggering re-renders upon updating state
  const hasCalledInitialCallbacks = useRef(false);
  const hasCalledConfirmationCallbacks = useRef(false);

  useEffect(() => {
    if (
      isFetched &&
      receipt &&
      receipt.status === "success" &&
      !hasCalledInitialCallbacks.current
    ) {
      console.log("Initial Success Callback");
      // ?.(<params>) => call the function with the params if it is not null
      onSuccess?.(receipt, false);
      onSettled?.(receipt, false);
      hasCalledInitialCallbacks.current = true;
    }
  }, [isFetched, receipt, onSuccess, onSettled]);

  useEffect(() => {
    if (
      isFetchedConfirmation &&
      isSuccessConfirmation &&
      receipt &&
      !hasCalledConfirmationCallbacks.current
    ) {
      console.log("Confirmation Success Callback");
      onSuccess?.(receipt, true);
      onSettled?.(receipt, true);
      hasCalledConfirmationCallbacks.current = true;
    } else if (error && !hasCalledConfirmationCallbacks.current) {
      onError?.(
        error instanceof Error ? error : new Error("Transaction is reverted")
      );
      hasCalledConfirmationCallbacks.current = true;
    }
  }, [
    isFetchedConfirmation,
    isSuccessConfirmation,
    receipt,
    error,
    onSuccess,
    onSettled,
    onError,
  ]);

  // Reset the refs when the receipt changes 
  useEffect(() => {
    hasCalledInitialCallbacks.current = false;
    hasCalledConfirmationCallbacks.current = false;
  }, [receipt]);
};
