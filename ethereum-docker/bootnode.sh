#!/bin/sh
#
# Runs a bootnode
#
# If there is a GEN_CHAIN_ID variable it is passed on to the container.
#

set -vx

docker stop ethereum-bootnode
docker rm ethereum-bootnode
IMGVERSION="latest"
#$(head -n 1 .IMGVERSION)
IMGVERSION=${IMGVERSION:-"latest"}
IMGNAME="bnhp/ethereum"
NET_ARG=
GEN_ARG=
[[ ! -z $GEN_CHAIN_ID ]] && NET_ARG="-e GEN_CHAIN_ID=$GEN_CHAIN_ID"
[[ ! -z $GEN_ALLOC ]] && GEN_ARG="-e GEN_ALLOC=$GEN_ALLOC"
DATA_ROOT=${DATA_ROOT:-$(pwd)}
docker run -d --name ethereum-bootnode \
    -v $DATA_ROOT/.bootnode:/opt/bootnode \
    -e "RUN_BOOTNODE=true" \
    $NET_ARG \
    $GEN_ARG \
    $IMGNAME:$IMGVERSION --verbosity=3

#    -p 30301:30301 \
#    -p 30301:30301/udp \
 #   --network ethereum \
