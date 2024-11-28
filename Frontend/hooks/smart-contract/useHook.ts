// create IDO, invest IDO, cancel IDO investment, claim token IDO, withdraw raised amount IDO (IDO owner), redeem IDO investment
import { Address, TransactionReceipt } from "viem";
import {
  useSimulateContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  useWriteContract
}
from "wagmi";
// import { useWriteContractCallbacks } from "./useWriteContractCallbacks";
// import { getKakarottoMarketplaceAddress } from "@/contracts/utils/getAddress.util";
// import getABI from "@/contracts/utils/getAbi.util";

type Props = {
  chainId?: number;
  tokenAddress: Address;
  tokenId: bigint;
  priceInWei: bigint;
  expiresAt: bigint;
  enabled?: boolean;
  onSuccess?: (data: TransactionReceipt) => void;
  onSettled?: (data?: TransactionReceipt) => void;
  onError?: (error?: Error) => void;
}

export const useCreateIDO = ({
  chainId,
  tokenAddress,
  tokenId,
  priceInWei,
  expiresAt,
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
    
  })
}