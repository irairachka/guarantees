#!/bin/bash
#
# Runs a bootnode as regular miner with no
#
# If there is a GEN_CHAIN_ID variable it is passed on to the container.
#

NODE_NAME=$1
NODE_NAME=${NODE_NAME:-"ethereum-bootnode"}

docker stop $NODE_NAME
docker rm $NODE_NAME
IMGVERSION="latest"
#$(head -n 1 .IMGVERSION)
IMGVERSION=${IMGVERSION:-"latest"}
IMGNAME="bnhp/ethereum-static"
NET_ARG=
GEN_ARG=
USE_STATIC_NODE_ARG="-e USE_STATIC_NODE=false"
[[ ! -z $PRIVATE_PORT ]] && PRIVATE_PORT=" -e PRIVATE_PORT=$PRIVATE_PORT"
[[ ! -z $USE_STATIC_NODE ]] && USE_STATIC_NODE_ARG=" -e USE_STATIC_NODE=$USE_STATIC_NODE"
[[ ! -z $GEN_CHAIN_ID ]] && NET_ARG="-e GEN_CHAIN_ID=$GEN_CHAIN_ID"
[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
[[ ! -z MINING_NODE ]]  && USE_MINING_NODE_ARG="-e MINING_NODE=$MINING_NODE"
[[ ! -z $RPC_PORT ]] && RPC_ARG='--rpc --rpcaddr=0.0.0.0 --rpcapi=db,eth,net,web3,personal --rpccorsdomain=*' && RPC_PORTMAP="-p $RPC_PORT:8545"
[[ ! -z $NPM_PORT ]] && NPM_PORTMAP="-p $NPM_PORT:3000"
BOOT_ROOT=${BOOT_ROOT:-$(pwd)}
DATA_ROOT=${DATA_ROOT:-"$(pwd)/.ether-$NODE_NAME"}
DATA_HASH=${DATA_HASH:-"$(pwd)/.ethash"}
docker run -d --name $NODE_NAME \
    -v $BOOT_ROOT/.bootnode:/opt/bootnode  \
    -v $DATA_ROOT:/root/.ethereum \
    -e "RUN_BOOTNODE=true" \
    $PRIVATE_PORT \
    $USE_STATIC_NODE_ARG \
    $USE_MINING_NODE_ARG \
    $RPC_PORTMAP $NPM_PORTMAP $UDP_PORTMAP \
    $NET_ARG \
    $GEN_ARG \
    $IMGNAME:$IMGVERSION $RPC_ARG --verbosity=2
