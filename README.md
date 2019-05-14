# Decentralized Star Notary Service

This is my implementation of Udacity Blockchain Developer Nanodegree - Project 5.

## Token info

- ERC-721 token name: `FooBar`
- ERC-721 token symbol: `FBT`
- `truffle` version: `v5.0.16`
- `openzeppelin-solidity` version: `2.2.0`

## Rinkeby deployment info

- Transaction hash: `0xc0b3dbcf965ff2aaa63f1a5ff4f5204a2195b5e28473381dfdc317f6bc303838`
- Contract address: `0x62b44bb77A6FE6E7DaB6bB64a51b26C43d1Fb9e4`

## Requirements

- [`yarn`](https://yarnpkg.com/)
- [`truffle`](https://truffleframework.com/truffle)

## Running

To run it, clone this repository, then:

```
yarn install
truffle develop
> compile
> migrate --reset
```

In another terminal, run:

```
cd app
yarn install
yarn run dev
```

Then with your browser go to the address indicated by webpack.

## Deploying to the Rinkeby network

In order to be able to deploy this contract to the Rinkeby test network, you first **MUST** create a file named `.secret` at the root of this project.

This file should contain your Metamask seed.

Then run:

```
truffle compile
truffle migrate --reset --network rinkeby
```
