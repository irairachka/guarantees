set -xv
#npm config set registry http://34.252.72.81:8081/artifactory/api/npm/npm-virtual/
# npm update
#npm update npm -g
#npm install -g how-to-npm

#truffle install

npm install truffle -g
npm install keythereum -g

# webpack install
git clone https://github.com/trufflesuite/truffle-init-webpack.git
truffle unbox webpack


# garanties intall
git clone https://github.com/shdmitry2000/guarantees.git /opt/guarantees
npm install forever forever-monitor -g
cd /opt/guarantees
npm install
#truffle compile
#cd /opt/guarantees/TruffleGUI/
#npm install
#npm run-script build --environment=service
cd /opt/guarantees/ExpressServer/
npm install
#sudo git pull origin newUI
#forever stop -c "npm start --env=service" ./
##forever stop -c "npm start --env=service" ./
##forever start -c "npm start --env=service" ./




#install examples
mkdir /opt/simple-storage
cd /opt/simple-storage
truffle init
echo "

 pragma  solidity ^0.4.17;


contract SimpleStorage {
  uint myVariable;

  function set(uint x) public {
    myVariable = x;
  }

  function get() constant public returns (uint) {
    return myVariable;
  }
}

"  > /opt/simple-storage/contracts/Store.sol

echo  "
var SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
 " > /opt/simple-storage/migrations/2_deploy_contracts.js

