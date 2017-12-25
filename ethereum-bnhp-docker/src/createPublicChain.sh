#!/bin/sh


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


