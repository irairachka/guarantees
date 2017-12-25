#!/bin/sh



set -xv

set

export MY_IP=$(ifconfig eth0 | awk '/inet addr/{print substr($2,6)}')

if [ ! -z $PRIVATE_PORT ]; then
        echo " recived  PRIVATE_PORT: '$PRIVATE_PORT' arguments..."
        PRIVATE_PORT="--port=$PRIVATE_PORT"
    else
        echo "Not recived  PRIVATE_PORT  arguments..."
fi



export GEN_ARGS=""
echo "MY_IP: '$MY_IP' port : '$PRIVATE_PORT'"

# replace vars
if [  -n  '$GEN_NONCE' ]; then
    echo "Generating genesis.nonce from '$GEN_NONCE' arguments..."
    sed "s/\${GEN_NONCE}/$GEN_NONCE/g" -i /opt/genesis.json
else
    echo "GEN_NONCE not found:'$GEN_NONCE'"
fi

echo "Generating genesis.alloc from arguments..."
sed "s/\${GEN_ALLOC}/$GEN_ALLOC/g" -i /opt/genesis.json

echo "Generating genesis.chainid from arguments..."
sed "s/\${GEN_CHAIN_ID}/$GEN_CHAIN_ID/g" -i /opt/genesis.json

echo "Running ethereum node with CHAIN_TYPE='$CHAIN_TYPE'"

export ACCOUNT_PASSWORD_URL="/opt/password.pas"
if  [ ! -z  $ACCOUNT_PASSWORD  ]; then
    echo "Saving password "
    echo "$ACCOUNT_PASSWORD"       >   $ACCOUNT_PASSWORD_URL
    tail $ACCOUNT_PASSWORD_URL
fi


if  [ $1 = "bash" ]; then
        set > /opt/setsforbash.sh
        echo "Running bash console..'$1'."
        exec /bin/bash
    else
        echo "Running bash not requested :'$1'"
fi

if  [ $CHAIN_TYPE = "private" ]  && [ $USE_STATIC_NODE = "true" ]; then
    echo "run create bnhp chain "
    ./createPrivateNoDiscoveryChain.sh "$@"
elif [ ! $CHAIN_TYPE = "private" ]; then
    echo "run create public chain "
    ./createPublicChain.sh "$@"
else
    echo "run create private chain "
    ./createPrivateChain.sh "$@"
fi

set +xv
