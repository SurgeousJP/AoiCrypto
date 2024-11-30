// <---! PRINTING AND EXECUTING SMART CONTRACT !---> //
// useEffect(() => {
//   console.log("Hook loading status: ", isLoading);
//   console.log("Hook error: ", error);
// }, [isLoading, error]);

// const onTestClick = async () => {
//   console.log("Test smart contract started");
//   try {
//     await onExecute();
//     console.log("Smart contract initiated...");
//   } catch (error) {
//     console.error("Error while executing smart contract :", error);
//   }
//   console.log("Test smart contract ended");
// };
// <---! PRINTING AND EXECUTING SMART CONTRACT !---> //

// <---! CREATE IDO !---> //
// const {
//   error: createIDOError,
//   isLoading: createIDOIsLoading,
//   onCreateIDO,
// } = useCreateIDO({
//   chainId: chainId,
//   idoInput: sampleCreateIDOInput,
//   enabled: true,
//   onSuccess: (data: TransactionReceipt) => {
//     console.log("Test creating IDO successfully");
//   },
//   onSettled: (data?: TransactionReceipt) => {
//     console.log("Test settled IDO successfully");
//   },
//   onError: (error?: Error) => {
//     console.log("An error occurred: ", error);
//   }
// });
// <---! CREATE IDO !---> //

// <---! CREATE ERC20 !---> //
// const {
//   error: createERC20Error,
//   isLoading: createERC20IsLoading,
//   onCreateNewERC20,
// } = useCreateNewERC20({
//   chainId: chainId,
//   newERC20: sampleCreateNewERC20Input,
//   enabled: true,
//   onSuccess: (data: TransactionReceipt) => {
//     console.log("Test creating IDO successfully");
//   },
//   onSettled: (data?: TransactionReceipt) => {
//     console.log("Test settled IDO successfully");
//   },
//   onError: (error?: Error) => {
//     console.log("An error occurred: ", error);
//   },
// });
// <---! CREATE ERC20 !---> //

// <---! DEPOSIT LIQUIDITY POOL !---> //
// const {
//   error: error,
//   isLoading: isLoading,
//   onDepositLiquidityPool: onExecute,
// } = useDepositLiquidityPool({
//   chainId: chainId,
//   poolId: 1700200000000n,
//   enabled: true,
//   onSuccess: (data: TransactionReceipt) => {
//     console.log("Test executing smart contract successfully");
//   },
//   onSettled: (data?: TransactionReceipt) => {
//     console.log("Test settled smart contract successfully");
//   },
//   onError: (error?: Error) => {
//     console.log("An error occurred: ", error);
//   },
// });
// <---! DEPOSIT LIQUIDITY POOL !---> //
