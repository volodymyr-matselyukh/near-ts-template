#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"


#near create-account matseliukh-test.testnet --useFaucet

# https://docs.near.org/tools/near-cli#near-dev-deploy
near deploy matseliukh-test.testnet build/contract.wasm