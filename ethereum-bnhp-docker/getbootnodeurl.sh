#!/bin/bash
nodename=ethereum-bootnode
ENODE_LINE=$(docker logs $nodename 2>&1 |  grep self=enode | grep enode | head -n 1)
echo "enode:${ENODE_LINE#*enode:}"

