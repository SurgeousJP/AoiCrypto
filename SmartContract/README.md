# AoiCrypto

## Deployment demo

- The deployed address demo consists of:

  - WETH: `0xa948F1ADA2a714F359035307B05Dd2CCbFbEef89`

  - AoiFactory: `0xd75E353e4541DDeFE159eD59488953e8f0AfE928`

  - AoiRouter: `0x1808061a4b4d7ceF8712b55D756D8Dd147aecFf0`

  - IDOFactory:

    - V1: `0x632a2Dca9A3Bb02Fde69C152A81160d54e38c130` (deprecated)

    - V2: `0x30B5aCF87E1E4b8a23F64270B86Aee7B416E2130` (latest)

  - ERC20Factory: `0xBB64692b13dE29e0f5370FBF476E471E6084d080`

- The ABI of those contracts include:

  - [WETH](/abis/WETH.json)

  - [IDOFactory](/abis/IDOFactory.json)

  - [IDOPool](/abis/IDOPool.json)

  - [ERC20Factory](/abis/ERC20Factory.json)

  - [AoiERC20](/abis/AoiERC20.json)

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
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
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
