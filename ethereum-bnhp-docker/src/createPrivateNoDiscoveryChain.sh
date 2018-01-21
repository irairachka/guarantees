#!/bin/sh

set
set -vx
DATA_DIR=${DATA_DIR:-"/root/.ethereum"}
#FIRST_ACCOUNT="0x0000000000000000000000000000000000000001"
echo "private CHAIN_TYPE '$CHAIN_TYPE' with DATA_DIR='$DATA_DIR', contents:"
ls -la $DATA_DIR
if [ ! -d "$DATA_DIR" ] || [ -d "ls -A $DATA_DIR" ]; then
   echo "DATA_DIR '$DATA_DIR' non existant or empty. Initializing DATA_DIR..."
   echo  " '--datadir $DATA_DIR init /opt/genesis.json' "
   /usr/local/bin/geth --datadir "$DATA_DIR" init /opt/genesis.json
   if   [ $INIT_ACCOUNT = "true" ]; then
        ACCOUNT_INIT=$(/usr/local/bin/geth --password "$ACCOUNT_PASSWORD_URL" --datadir "$DATA_DIR" account new)
        ACCOUNT_INIT=$(echo  "$ACCOUNT_INIT"  |awk -F  { '{print $2}' | awk -F  } '{print $1}' )
        echo "static node ACCOUNT_INIT '$ACCOUNT_INIT' "
        FIRST_ACCOUNT=$ACCOUNT_INIT
        echo "FIRST_ACCOUNT '$FIRST_ACCOUNT' "
   else
        echo "init account not requested FIRST_ACCOUNT '$FIRST_ACCOUNT' "
   fi
 else
   echo "DATA_DIR '$DATA_DIR'  existant or not empty. Initializing DATA_DIR escaped"
   ACCOUNTS_LIST=$(/usr/local/bin/geth --password "$ACCOUNT_PASSWORD_URL" --datadir "$DATA_DIR" account  list)
   echo "ACCOUNTS_LIST '$ACCOUNTS_LIST' "
   FIRST_ACCOUNT=$( echo  $ACCOUNTS_LIST | grep 'Account #0:' |awk -F  { '{print $2}' | awk -F  } '{print $1}' )
   echo "FIRST_ACCOUNT  from chain '$FIRST_ACCOUNT' "
 fi

 [  -z $FIRST_ACCOUNT ] && FIRST_ACCOUNT="0x0000000000000000000000000000000000000001"


if  [ $MINING_NODE = "true" ]; then
    BOOTNODE_URL_STR=" --mine --minerthreads=1 --etherbase=$FIRST_ACCOUNT"
fi



 GEN_ARGS="--datadir $DATA_DIR"
 if  [ -n $GEN_CHAIN_ID ] ; then
        GEN_ARGS="$GEN_ARGS --networkid=$GEN_CHAIN_ID"
        echo " Using options: GEN_ARGS->'$GEN_ARGS' "
  else
        echo " networkid is not defined"
  fi

  GEN_ARGS="$GEN_ARGS $PRIVATE_PORT"
#  [ ! -z $BOOTNODE_URL ] && BOOTNODE_URL_STR="$BOOTNODE_URL_STR --bootnodes=$BOOTNODE_URL"
  echo " Using options: GEN_ARGS='$GEN_ARGS'"


if   [ ! $RUN_BOOTNODE = "true" ]; then
    echo "Running static node..."
    echo '[   '        >   $DATA_DIR/static-nodes.json
    echo '"'"$BOOTNODE_URL"'"'    >>  $DATA_DIR/static-nodes.json
    echo ' ] '         >>  $DATA_DIR/static-nodes.json
    tail $DATA_DIR/static-nodes.json
    BOOTNODE_URL_STR="$BOOTNODE_URL_STR --nodiscover"
fi

set +vx

RUN_COMMAND="/usr/local/bin/geth --targetgaslimit='9000000000000' $BOOTNODE_URL_STR $GEN_ARGS $@ "
echo "Running geth with arguments : $RUN_COMMAND"
eval $RUN_COMMAND


#start product
cd /opt/guarantees/ExpressServer/
npm start --env=service
if   [  $RUN_BOOTNODE = "true" ]; then
    npm start --env=service
else

fi

