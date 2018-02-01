#!/bin/bash
set -vx

IMGVERSION="latest"
#$(head -n 1 .IMGVERSION)
IMGVERSION=${IMGVERSION:-"latest"}
IMGNAME="bnhp/ethereum"
#$(head -n 1 .IMGNAME)
NODE_NAME=$1
NODE_NAME=${NODE_NAME:-"node1"}
CONTAINER_NAME="ethereum-$NODE_NAME"
DATA_ROOT=${DATA_ROOT:-$(pwd)}
echo "Destroying old container $CONTAINER_NAME..."
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
NET_ARG=
GEN_ARG=
RPC_ARG=
RPC_PORTMAP=
UDP_PORTMAP=
[[ ! -z $GEN_CHAIN_ID ]] && NET_ARG="-e GEN_CHAIN_ID=$GEN_CHAIN_ID"
[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
#[[ ! -z $RPC_PORT ]] && RPC_ARG='--rpc --rpcaddr=0.0.0.0 --rpcapi=db,eth,net,web3,personal --rpccorsdomain "*"' && RPC_PORTMAP="-p $RPC_PORT:8545"
#[[ ! -z $UDP_PORT ]] && UDP_PORTMAP="-p $UDP_PORT:30303 -p $UDP_PORT:30303/udp"
BOOTNODE_URL=${BOOTNODE_URL:-$(./getbootnodeurl.sh)}
echo "Running new container $CONTAINER_NAME..."
docker run -d --name $CONTAINER_NAME \
    -e "BOOTNODE_URL=$BOOTNODE_URL" \
    $NET_ARG $GEN_ARG $RPC_PORTMAP $UDP_PORTMAP \
    $IMGNAME:$IMGVERSION $RPC_ARG --identity $NODE_NAME --cache=512 --verbosity=3 ${@:2}


#docker run -d --name $CONTAINER_NAME \
#    -v $DATA_ROOT/.ether-$NODE_NAME:/root \
#    -e "BOOTNODE_URL=$BOOTNODE_URL" \
#    $NET_ARG $GEN_ARG $RPC_PORTMAP $UDP_PORTMAP \
#    $IMGNAME:$IMGVERSION $RPC_ARG --identity $NODE_NAME --cache=512 --verbosity=6 --maxpeers=3 ${@:2}
