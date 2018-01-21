./ethereum-bnhp-docker/killall.sh
./ethereum-bnhp-docker/wipeall.sh
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
#docker rmi $(docker images -q name=*)
docker rmi bnhp/ethereum-static
rm -rf ethereum-bnhp-docker/
cp -rf  /Users/dmitryshlymovich/workspace/ethereum-garanties/truffle_eth_bnhp/ethereum-bnhp-docker .
cd ethereum-bnhp-docker/
docker build -t bnhp/ethereum-static .
#./bootnodeBnhp.sh
#docker logs ethereum-bootnode-static