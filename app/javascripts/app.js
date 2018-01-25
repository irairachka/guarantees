// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import  GuaranteeRequest_artifact from '../../build/contracts.private.net/GuaranteeRequest.json'
import  Regulator_artifact from '../../build/contracts.private.net/Regulator.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.

var Regulator = contract(Regulator_artifact);
var GuaranteeRequest = contract(GuaranteeRequest_artifact);

const http=require('http');
const web3providera=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;


var watcherReq;
var watcherSign;

var latestWatched;

window.App = {
  start: function () {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Regulator.setProvider(web3.currentProvider);
    GuaranteeRequest.setProvider(web3.currentProvider);

    // web3.eth.getBlock(48, function(error, result){
    //   if(!error)
    //     console.log(result)
    //   else
    //     console.error(error);
    // })

    console.log(web3.eth.accounts);

    // Get the initial account balance so it can be displayed.
    web3providera.eth.getAccounts(function (error, accs) {
      console.log(error, accs);
      if (error != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      // latestWatched        =0;
      // self.refreshBalance();


    });

    

    // web3.eth.getBlock('latest', function(error, result){
    //   if (error != null) {
    //     alert("There was an error fetching last block .");
    //     latestWatched        =0;
    //     return;
    //   }
    //
    //   latestWatched        = 0;//result.number.valueOf();
    //
    //   self.startSignListener();
    //   self.startRequestListener();
    //
    //
    // });
  },
  
  initBlockChain: function() {
    var self = this;
    self.submitCustomerCall(account ,"מושה ישראלי","הרצל 1 ראשון לציון");
    self.submitIssuerCall(account ,"בנק הפועלים","הנגב 11");
    self.submitBeneficiaryCall(account ,"עיריית תל אביב-יפו","אבן גבירול 69 תל אביב-יפו");
    
  },

  submitCustomerCall: function(theAccount,theName,theAddress) {
    var self = this;
    Regulator.deployed().then(function (instance) {
      console.log("submitCustomer ");
      return instance.submitCustomer.call(theAccount,theName,theAddress,{from: account});
    }).then(function (result) {
      console.log("submitCustomer end :");
      console.log(result);
    }).catch(function (e) {
      console.log(e);
      self.setRegisterStatus("Unable to submitCustomer ; see log.",e);
    });


  },

  submitIssuerCall: function(theAccount,theName,theAddress) {

    var self = this;
    Regulator.deployed().then(function (instance) {
      console.log("submitIssuer ");
      return instance.submitIssuer.call(theAccount,theName,theAddress,{from: account});
    }).then(function (result) {
      console.log("submitIssuer end :");
      console.log(result);
    }).catch(function (e) {
      console.log(e);
      self.setRegisterStatus("Unable to submitIssuer ; see log.",e);
    });

  },

  submitBeneficiaryCall: function(theAccount,theName,theAddress) {
    var self = this;
    Regulator.deployed().then(function (instance) {
      console.log("submitBeneficiary ");
      return instance.submitBeneficiary.call(theAccount,theName,theAddress,{from: account});
    }).then(function (result) {
      console.log("submitBeneficiary :");
      console.log(result);
    }).catch(function (e) {
      console.log(e);
      self.setRegisterStatus("Unable to submitBeneficiary ; see log.",e);
    });
  },
  

  listGRequests: function () {
  var self = this;
    document.getElementById("activeRequests").innerHTML = '';
      var Regulator_instance;
      console.log("begin");
      Regulator.deployed().then(function (instance) {
        Regulator_instance = instance;
        console.log("instance");
        return Regulator_instance.getRequestsAddressForCustomer.call({from: account});
      }).then(function (guaranteeRequestAddresses) {
         console.log(guaranteeRequestAddresses);

        // requestAddress=guaranteeRequestAddresses[0];
        guaranteeRequestAddresses.forEach(function(requestAddress) {
          console.log("requestAddress:"+requestAddress);
          GuaranteeRequest.at(requestAddress).then(function (guaranteeRequestinstance) {
          var guaranteeRequest_instance = guaranteeRequestinstance;
          return guaranteeRequest_instance.getGuaranteeRequestData();
        }).then(function (result) {
            console.log("result:"+result);
          document.getElementById("activeRequests").innerHTML += "<br> guarantee for " + result[4] + " ammount: " + result[5] + " othere:" + result[6] +  "<br />";
          //
          // console.log("getGuaranteeRequestData result for type:" + typeof(result));
          // console.log(result);
          // console.log(result[0], result[2], result[3], result[4], result[5]);
          // console.log(result[6]);
          //
          // console.log(result[10]);
          
        }).catch(function (e) {
          // console.log(e);
          self.setRegisterStatus("Unable to refresh balance; see log.",e);
        });
      });
    }).catch(function (e) {
        // console.log(e);
        self.setRegisterStatus("Unable to refresh balance; see log.",e);
      });

    },


  addRequest: function ( account1 ,account2,account3,purpose, amount, beginDate,endDate,indexType,indexDate){
    var self = this;

    console.log("begin");
    Regulator.deployed().then(function (instance) {
      console.log("instance");


     
      var dt=(Date.now()/1000);

        return instance.createGuaranteeRequest(account1 ,account2,account3,purpose, amount,beginDate,endDate,indexType,indexDate,{from: account ,gas: 6000000});
    }).then(function (guaranteeRequestAddresses) {
          console.log(guaranteeRequestAddresses);

    }).catch(function (e) {
      console.log(e);
      self.setRegisterStatus("Unable to refresh balance; see log.",e);
    });

  },


  setRegisterStatus: function(message,error) {
    console.log(error);
    var status = document.getElementById("registerStatus");
    status.innerHTML = message + " =>"+ error;
  },




};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  var web3provider;
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    console.warn("Use Mist/MetaMask's provider");

    web3provider= new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3provider=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  window.web3 =web3provider;


  App.start();
});
