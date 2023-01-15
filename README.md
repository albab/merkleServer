merkle tree server
===================

# Intro

If you want to allow users to mint from your contracts using an allowlist, you'll most likely need a [merkle tree](https://en.wikipedia.org/wiki/Merkle_tree). This repo allows you to generate a merkle tree from a list of wallet addresses in a CSV file (exported from somewhere like [premint](https://www.premint.xyz/)), and check via an endpoint to see if a given wallet address is in the tree or not.

This app was used during the [PhrazeBoard](https://phrazeboard.xyz/) mint process; we took heed of the issues [Tubby Cats](https://github.com/tubby-cats/tubby-launch-reflections) ran into during their launch, which led us to having the convenience of updating the allowlist at anytime.

For instructions on how to use merkle trees in your contract, check out my other repo [here](https://github.com/albab/merkleContract).


# Setup

Add wallet addresses to data.csv (_note:_ if you need to, be sure to run any scripts to remove duplicates, format addresses, etc. before running)

Install & run the application to create the merkle tree from address list:

```
yarn install
yarn start
```

# Finding merkle tree root

Send a GET request to http://localhost:3000/root to retrieve the root of the tree:

```
{
    "data": "080ff916ba312b937f171a46eecc887450d06d3f6f8a7154bae19fdfd59d9f68"
}
```

Set this value in your contract, prepended with 0x, and without strings (see [here](https://github.com/albab/merkleContract/blob/main/Contract.sol#L28)):

```
0x080ff916ba312b937f171a46eecc887450d06d3f6f8a7154bae19fdfd59d9f68
```


# Checking allowlist

Send a POST request to the server with a wallet address as the query param - http://localhost:3000/?address=0x6723162BaB75Ed930263AEFC228fFa6606CB31c8

Should return back proof in the form of an array if found:

```
{
    "data": [
        "0xfc7f6d28b6aaae18613cae3e909521ff373e706b0cb2a58d22c46ea05d407d37"
    ]
}
```

See how proof is used in tests / public contract methods [here](https://github.com/albab/merkleContract/blob/main/test.js#L29).


Will return empty array if not found:

```
{
    "data": []
}
```

# Deploy

Simply import this repo into a [Digital Ocean 1-Click App](https://docs.digitalocean.com/glossary/one-click/), [Bitnami](https://bitnami.com/), [Sandstorm](https://sandstorm.io/), or whatever else you want to use.