#!/bin/bash
set
set -xv
IMGVERSION="latest"
#IMGVERSION="latest"
#$(head -n 1 .IMGVERSION)
IMGVERSION=${IMGVERSION:-"latest"}
IMGNAME="bnhp/ethereum-static"
#$(head -n 1 .IMGNAME)
NODE_NAME=$1
NODE_NAME=${NODE_NAME:-"node1"}
CONTAINER_NAME="ethereum-$NODE_NAME"
echo "Destroying old container $CONTAINER_NAME..."
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
NET_ARG=
GEN_ARG=
RPC_ARG=
RPC_PORTMAP=
UDP_PORTMAP=
#RPC_PORT="8545"
#NPM_PORT="3000"
USE_STATIC_NODE_ARG="-e USE_STATIC_NODE=false"
[[ ! -z $USE_STATIC_NODE ]] && USE_STATIC_NODE_ARG=" -e USE_STATIC_NODE=true"
[[ ! -z $GEN_CHAIN_ID ]] && NET_ARG="-e GEN_CHAIN_ID=$GEN_CHAIN_ID"
[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
[[ ! -z MINING_NODE ]]  && USE_MINING_NODE_ARG="-e MINING_NODE=$MINING_NODE"
[[ ! -z $RPC_PORT ]] && RPC_ARG='--rpc --rpcaddr=0.0.0.0 --rpcapi=db,eth,net,web3,personal --rpccorsdomain=*' && RPC_PORTMAP="-p $RPC_PORT:8545"
[[ ! -z $NPM_PORT ]] && NPM_PORTMAP="-p $NPM_PORT:3000"
#[[ ! -z $UDP_PORT ]] && UDP_PORTMAP="-p $UDP_PORT:30303 -p $UDP_PORT:30303/udp"
#[[ ! -z $BOOTNODE_URL ]] && BOOTNODE_URL="enode://52499373e92bbc7edc8a2e0e06f9dc83d5cbd9cb31ee0dcdd555e04a06f9f2fb08e27f4d827a19f6f0c68cd534e1a41e92895fea26637b917fd6f4fb0b910e7c@35.158.33.72:30776"
BOOTNODE_URL=${BOOTNODE_URL:-$(./getbootnodeurl.sh)}
echo "Running new container $CONTAINER_NAME..."
DATA_ROOT=${DATA_ROOT:-"$(pwd)/.ether-$NODE_NAME"}
DATA_HASH=${DATA_HASH:-"$(pwd)/.ethash"}
#docker run -d --name $CONTAINER_NAME \
#    -e "BOOTNODE_URL=$BOOTNODE_URL" \
#    -e "USE_STATIC_NODE=true" \
#    $NET_ARG $GEN_ARG $RPC_PORTMAP $UDP_PORTMAP \
#    $IMGNAME:$IMGVERSION $RPC_ARG --identity=$NODE_NAME --mine --minerthreads=1 --verbosity=3 ${@:2}


docker run -d --name $CONTAINER_NAME \
    -e "BOOTNODE_URL=$BOOTNODE_URL" \
    -e "PRIVATE_PORT=30776" \
    -v $DATA_ROOT:/root/.ethereum \
    $USE_STATIC_NODE_ARG \
    $USE_MINING_NODE_ARG \
    $NET_ARG $GEN_ARG $RPC_PORTMAP $NPM_PORTMAP $UDP_PORTMAP \
    $IMGNAME:$IMGVERSION $RPC_ARG --identity=$NODE_NAME  --verbosity=3 ${@:2}

#    -v $DATA_ROOT/.ether-$NODE_NAME:/root \
#-e "PRIVATE_PORT=$PRIVATE_PORT" \
