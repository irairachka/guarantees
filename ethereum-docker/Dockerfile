# Ethereum playground for private networks
# Playground Ethereum para redes privadas

# Why not the official image?
# Until 1.7.2 the public image does NOT contain tools beyond geth,
# so we build a new just like the original Dockerfile suggests.
# It seems that future image releases will carry these binaries.

FROM ubuntu:latest

LABEL maintainer="andre@vertigo.com.br"

ARG GETH_URL=https://gethstore.blob.core.windows.net/builds/geth-alltools-linux-amd64-1.7.2-1db4ecdc.tar.gz
ARG GETH_MD5=c17c164d2d59d3972a2e6ecf922d2093
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt-get install net-tools && \
    apt install wget -y && \
    cd /tmp && \
    wget "$GETH_URL" -q -O /tmp/geth-alltools-linux-amd64.tar.gz && \
    echo "$GETH_MD5  geth-alltools-linux-amd64.tar.gz" > /tmp/geth-alltools-linux-amd64.tar.gz.md5 && \
    md5sum -c /tmp/geth-alltools-linux-amd64.tar.gz.md5 && \
    tar -xzf /tmp/geth-alltools-linux-amd64.tar.gz -C /usr/local/bin/ --strip-components=1 && \
    rm -f /usr/local/bin/COPYING && \
    rm -f /tmp/geth-alltools-*

ENV GEN_NONCE="0x0000000000000042" \
    DATA_DIR="/root/.ethereum" \
    CHAIN_TYPE="private" \
    RUN_BOOTNODE=false \
    USE_STATIC_NODE=false \
    GEN_CHAIN_ID=777 \
    GEN_ALLOC=""


WORKDIR /opt

# like ethereum/client-go
EXPOSE 30303
EXPOSE 30303/udp
EXPOSE 8545
EXPOSE 30776
EXPOSE 30776/udp

# bootnode port
EXPOSE 30301
EXPOSE 30301/udp
EXPOSE 30776
EXPOSE 30776/udp

ADD src/* /opt/
RUN chmod +x /opt/*.sh

#CMD ["/opt/startgeth.sh"]
ENTRYPOINT ["/opt/startgeth.sh"]

