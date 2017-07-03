# Private, decentralised data-sharing

[![Build Status](https://travis-ci.com/FreddieLindsey/truffle-webpack-boilerplate.svg?token=2txBfbss4toxp7qpR4fW&branch=master)](https://travis-ci.com/FreddieLindsey/truffle-webpack-boilerplate)

## Introduction

Since the introduction of centrally-held, government and corporation-authored ledgers the average citizen has slowly been giving up their privacy for the sake of convenience. However, 323 years since the Bank of England introduced paper money into the UK economy, this project serves as a proof of concept that we can share our data privately in a way which benefits the consumer and the producer equally.

Fundamentally, the user's privacy is vastly improved compared to current centralised systems, user control is (mostly) maximised, and the security of the network is upheld through being publicly verifiable and available.

## Getting started

- Blockchain technology
- Off-chain storage
- Decentralised, distributed client interface

Above are the key components that form the system. Below are instructions on how to run them locally.

```bash
# Proxy Re-Encryption local server
docker-compose up -d

# Blockchain technology (EthereumJS's testrpc)
yarn run testrpc

# Off-chain storage (IPFS)
yarn run ipfs

# Client interface (webpack-dev-server / react)
yarn start
```

> *Note, these must be started in separate terminals.*

Have fun!

## Demonstration

For demonstration purposes, the following functionality can be demonstrated:

- Individual Account Setup
- Individual Data Management (inc. permissions)
- Individual Data Sharing
- Group Account Setup
- Group Member Addition
- Group Member Invalidation
- Group Data Management (inc. permissions)
- Group Data Sharing

## Related works

Please see the following for related material:

- [Project Report](https://github.com/FreddieLindsey/blockchain-layered-data-access)
- [Local Proxy Re-encryption Gateway](https://github.com/FreddieLindsey/blockchain-layered-data-access-gateway)
- [Presentation Script](https://github.com/FreddieLindsey/blockchain-layered-data-access-presentation)
