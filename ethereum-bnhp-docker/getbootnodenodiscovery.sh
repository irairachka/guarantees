#!/bin/bash
nodename="ethereum-bootnode-static"

DOCKER_IP=$(docker inspect   ethereum-bootnode-static |  grep '"IPAddress"' | head -n 1 |awk -F  ": " '{print $2}' |  awk -F  '"' '{print $2}' | awk -F  '"' '{print $1}')
ENODE_LINE=$(docker logs ethereum-bootnode-static 2>&1 |  grep self=enode | grep enode | head -n 1 | awk -F  "self=enode://" '{print $2}' | awk -F  '[::]' '{print $1$4} ' |  awk -F  [ '{print $1"'$DOCKER_IP':"$2} ' )
echo "enode://${ENODE_LINE#*enode:}"
