// Allows us to use ES6 in our migrations and tests.
require('babel-register');
var request = require('request')

module.exports = {
  networks: {
    development: {
      // host: '127.0.0.1',
      host: 'ec2-52-59-221-203.eu-central-1.compute.amazonaws.com' ,
      port: 8545,
      network_id: '*',// Match any network id
      gas: 5700000
    }
  }
};
