# AoiCrypto

## Deployment demo

The deployed address demo consists of:

- WETH: `0xa948F1ADA2a714F359035307B05Dd2CCbFbEef89`

- AoiFactory: `0xd75E353e4541DDeFE159eD59488953e8f0AfE928`

- AoiRouter: `0x1808061a4b4d7ceF8712b55D756D8Dd147aecFf0`

- IDOFactory: `0x632a2Dca9A3Bb02Fde69C152A81160d54e38c130`

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
