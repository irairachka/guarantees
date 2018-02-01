#!/bin/sh

set
set -vx


MY_IP=$(ifconfig eth0 | awk '/inet addr/{print substr($2,6)}')

if [ ! -z $PRIVATE_PORT ]; then
        echo " recived  PRIVATE_PORT: '$PRIVATE_PORT' arguments..."
        PRIVATE_PORT="--port=$PRIVATE_PORT"
    else
        echo "Not recived  PRIVATE_PORT  arguments..."
fi


GEN_ARGS=""
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

if  [ $CHAIN_TYPE = "private" ]; then
  # empty datadir -> geth init
  DATA_DIR=${DATA_DIR:-"/root/.ethereum"}
  echo "DATA_DIR='$DATA_DIR', contents:"
  ls -la $DATA_DIR
  if [ ! -d "$DATA_DIR" ] || [ -d "ls -A $DATA_DIR" ]; then
      echo "DATA_DIR '$DATA_DIR' non existant or empty. Initializing DATA_DIR..."
      echo  " '--datadir $DATA_DIR init /opt/genesis.json' "
      /usr/local/bin/geth --datadir "$DATA_DIR" init /opt/genesis.json
  else
      echo "DATA_DIR '$DATA_DIR'  existant or not empty. Initializing DATA_DIR escaped"
  fi
  GEN_ARGS="--datadir $DATA_DIR"
  if  [ -n $GEN_CHAIN_ID ] ; then
        GEN_ARGS="$GEN_ARGS --networkid=$GEN_CHAIN_ID"
        echo " Using options: GEN_ARGS->'$GEN_ARGS' "
    else
        echo " networkid is not defined"
  fi
  GEN_ARGS="$GEN_ARGS $PRIVATE_PORT"
#  [[ ! -z $MY_IP ]] && GEN_ARGS="$GEN_ARGS --nat=extip:$MY_IP"
#  GEN_ARGS="$GEN_ARGS --nat=any"
  [  -n $BOOTNODE_URL ] && BOOTNODE_URL_STR="--bootnodes $BOOTNODE_URL"
  echo " Using options: GEN_ARGS='$GEN_ARGS'"
fi

if  [ $USE_STATIC_NODE = "true" ]; then
    echo "Running static node..."
    echo '[   '        >   $DATA_DIR/static-nodes.json
    echo '"'"$BOOTNODE_URL"'"'    >>  $DATA_DIR/static-nodes.json
    echo ' ] '         >>  $DATA_DIR/static-nodes.json
    tail $DATA_DIR/static-nodes.json
    BOOTNODE_URL_STR=  #--nodiscover
fi

if  [ $1 = "bash" ]; then
        echo "Running bash console..'$1'."
        exec /bin/bash
    else
        echo "Running bash not requested :'$1'"
fi



if  [ $RUN_BOOTNODE = "true" ]; then
    echo "Running bootnode..."
    KEY_FILE="/opt/bootnode/boot.key"
    mkdir -p /opt/bootnode
    if [ ! -f "$KEY_FILE" ]; then
       echo "(creating $KEY_FILE)"
       bootnode --genkey="$KEY_FILE"
    fi
    [ -z $BOOTNODE_SERVICE ] && BOOTNODE_SERVICE=$MY_IP
    echo "Running bootnode with arguments '--nodekey=$KEY_FILE --addr $BOOTNODE_SERVICE:30301 $@'"
    exec /usr/local/bin/bootnode --nodekey="$KEY_FILE" --addr "$BOOTNODE_SERVICE:30301" "$@"
#    exec /usr/local/bin/bootnode --nodekey="$KEY_FILE" "$@"
fi


echo "Running geth with arguments : /usr/local/bin/geth $BOOTNODE_URL_STR $GEN_ARGS $@"
exec /usr/local/bin/geth $BOOTNODE_URL_STR $GEN_ARGS "$@"


