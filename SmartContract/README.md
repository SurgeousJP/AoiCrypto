# AoiCrypto

## Deployment demo

- The deployed address demo consists of:

  - WETH:

    - V1: `0xa948F1ADA2a714F359035307B05Dd2CCbFbEef89`

  - AoiFactory:

    - V1: `0xd75E353e4541DDeFE159eD59488953e8f0AfE928` (deprecated)

    - V2: `0x4B35AeeeEe8D33b64619eFE51C3151f478F95e44`

  - AoiRouter:

    - V1: `0x1808061a4b4d7ceF8712b55D756D8Dd147aecFf0` (deprecated)

    - V2: `0xac5f071284a515878D7420E60a2f8a82EaedDcDc`

  - IDOFactory:

    - V1: `0x632a2Dca9A3Bb02Fde69C152A81160d54e38c130` (deprecated)

    - V2: `0x30B5aCF87E1E4b8a23F64270B86Aee7B416E2130` (deprecated)

    - V3: `0x0Fa043F95487c58d1883A1A1965edaaD004Dc063` (deprecated)

    - V4: `0x12De8e7C39EE62282Af548F1a1E4128101567837` (deprecated)

    - V5: `0x287240Be56BDb74A9fb6a6507db3152e69e620F8`

  - ERC20Factory: `0xBB64692b13dE29e0f5370FBF476E471E6084d080`

- The ABI of those contracts include:

  - [WETH](/abis/WETH.json)

  - [IDOFactory](/abis/IDOFactory.json)

  - [IDOPool](/abis/IDOPool.json)

  - [ERC20Factory](/abis/ERC20Factory.json)

  - [AoiERC20](/abis/AoiERC20.json)

  - [AoiFactory](/abis/AoiFactory.json)

  - [AoiRouter](/abis/AoiRouter.json)

  - [AoiPair](/abis/AoiPair.json)

## Contract Detail

- IDOFactory: This contract is used to create new `IDOPool` contract and list to DEX after raising successfully.

  - createPool(): Must approve ERC20 token which will be sell for this contract before call this function.

  - depositLiquidityPool(): Only called after ido succeed.

- IDOPool: IDOPool created from IDOFactory is used to be invested and claimed by users.

  - investPool(): Investors can invest to the desired IDO by calling this. Note: The value of transaction is the amount of money would like to invest.

  - cancelInvestment(): Cancel the investment

  - registerPrivatePool(): Register to the Private pool only.

  - cancelRegisterPrivatePool(): Cancel the registry

  - claimToken(): Claim the ido token after raising ido successfully. (raisedAmount >= softCap)

  - refundToken(): Refund money to investors after raising failed. (raisedAmount < softCap)

  - withdrawRemainingToken(): Only IDO's owner, withdrawing the remaining token in pool after listing in DEX.

- ERC20Factory: Enables users to create ERC20 token by themselves.

  - createNewERC20(): Create ERC20 token

- AoiFactory: Factory is used to manage the Liquidity Pair (pool).

  - getPair(address token0, address token1):address

    Get the pair address for the pair tokens. If it returns address(0), the pair address have not existed yet.

- AoiRouter: This router allows user to trade their token.

  - WETH(): address

    Get the address of token WETH

  - getAmountOut(uint256 amountIn, uint256 reserve0 ,uint256 reserve1): uint256

    Get the amountOut based on the amountIn, reserve0 (tokenIn). reserve1 (tokenOut).

  - swapExactETHForTokens(
    uint256 amountOutMin,
    address[] path,
    address to,
    uint256 deadline
    ): uint256[]

    Swap from `ETH` to `tokens`. The `path` is the path of addresses for moving from `ETH` to final `token`. For example: Swap from ETH -> USDT but there are no direct pair between them, then need the immediate token => ETH -> USDC -> USDT => `path = [address(WETH, address(USDC), address(USDT)]`. If there is a direct path, just push the address of final token to it, such as `path = [address(USDT)]`. The first element is always `address(WETH)` and the last element is always ``address(tokenOut)` as well.

    Note: The `amountOutMin` is computed by `getAmountOut()` and the `slippage` (in the front end). For example, the `slippage` is set to `10`, `amountOutMin = getAmountOut() * slippage / 100` => `amountOutMin = getAmountOut() * 10 / 100`. The deadline is the executing duration, `deadlineInFrontEnd` will be set in the frontend and `deadline = currentTime + deadlineInFrontEnd`. If the `token` is `WETH`, we don't have to use this methods. We should use the `deposit()` in the WETH abi to wrap the `ETH` to the `WETH`.

  - swapExactTokensForETH(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] path,
    address to,
    uint256 deadline
    )

    Swap from `token` to `ETH`. This methods does same way with the `swapExactETHForTokens()`

    Note: if the `token` is `WETH`, we don't have to use this methods. We should use the `withdraw()` in the WETH abi to unwrap the `WETH` to the `ETH. Last element in path is `address(WETH)`

  - swapExactTokensForTokens(
    uint256 amountIn,
    uint256 amountOutMin,
    address[] path,
    address to,
    uint256 deadline
    )

    Swap from `token` to `token`.

- AoiPair: Storing the amount of 2 tokens.

  - token0(): address

    Get the address of token0

  - token1(): address

    Get the address of token1

  - getReserves(): (uint256 reserve0, uint256 reserve1, uint32 blockTimestampLast)

    Get the reserve value for both token0 and token1 in the specific pair

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ source .env
```

```shell
$ forge script --chain sepolia script/CustomScript.s.sol:CustomScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
