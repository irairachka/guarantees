#!/bin/sh
#
# Runs a bootnode
#
# If there is a GEN_CHAIN_ID variable it is passed on to the container.
#

#nodename="ethereum-bootnode-static"
#docker stop $nodename
#docker rm $nodename
#IMGVERSION="latest"
##$(head -n 1 .IMGVERSION)
#IMGVERSION=${IMGVERSION:-"latest"}
#IMGNAME="bnhp/ethereum-static"
#NET_ARG=
#GEN_ARG=
#[[ ! -z $GEN_CHAIN_ID ]] && NET_ARG="-e GEN_CHAIN_ID=$GEN_CHAIN_ID"
#[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
#[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
#DATA_ROOT=${DATA_ROOT:-$(pwd)}
#docker run -d --name $nodename \
#    -v $DATA_ROOT/.bootnode:/opt/bootnode \
#    -e "RUN_BOOTNODE=true" \
#    -e "USE_STATIC_NODE=true" \
#    -e "CREATE_INIT_ACCOUNT=true" \
#    $NET_ARG \
#    $GEN_ARG \
#    $IMGNAME:$IMGVERSION --verbosity=3


export nodename="ethereum-bootnode-static"
export USE_STATIC_NODE=true
export PRIVATE_PORT=30776
export MINING_NODE="true"
export CREATE_INIT_ACCOUNT="true"
export RPC_PORT="8545"
export NPM_PORT="3000"
export PRODUCT_SHARE='-v $DATA_ROOT/guarantees:/opt/guarantees'
./bootnode.sh $nodename