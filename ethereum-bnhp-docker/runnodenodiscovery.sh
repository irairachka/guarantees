#!/bin/bash
export USE_STATIC_NODE=true
export PRIVATE_PORT=30776
#export BOOTNODE_URL="enode://52499373e92bbc7edc8a2e0e06f9dc83d5cbd9cb31ee0dcdd555e04a06f9f2fb08e27f4d827a19f6f0c68cd534e1a41e92895fea26637b917fd6f4fb0b910e7c@35.158.33.72:30776"
export MINING_NODE=true
NODE_NAME=$1
NODE_NAME=${NODE_NAME:-"node1"}
export BOOTNODE_URL=$(./getbootnodenodiscovery.sh)
./runnodestatic.sh $NODE_NAME