#!/bin/bash
IMGVERSION=1.0
#$(head -n 1 .IMGVERSION)
IMGVERSION=${IMGVERSION:-"latest"}
IMGNAME=bnhp/ethereum-static
#$(head -n 1 .IMGNAME)
ARGPROXY=
[[ ! -z "$http_proxy" ]] && ARGPROXY="--build-arg http_proxy=$http_proxy"
[[ ! -z "$https_proxy" ]] && ARGPROXY="$ARGPROXY --build-arg https_proxy=$https_proxy"
[[ ! -z "$no_proxy" ]] && ARGPROXY="$ARGPROXY --build-arg no_proxy=$no_proxy"
echo "Building $IMGNAME:latest"
[[ ! -z "$ARGPROXY" ]] && echo "ARGPROXY=$ARGPROXY"
docker build $ARGPROXY \
  -t "$IMGNAME:$IMGVERSION" .
echo "Done!"

docker save $IMGNAME:$IMGVERSION --output "ethereum-truffle-bhnp-playgroung.$IMGVERSION.tar"