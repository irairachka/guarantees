// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import Registry_artifact from '../../build/contracts/Registry.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.

var Registry = contract(Registry_artifact);

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
    Registry.setProvider(web3.currentProvider);
    // Registry.setProvider(web3providera);

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

  

  // refreshBalance: function () {
  //   var self = this;
  //   var Registry_instance;
  //   Registry.deployed().then(function (instance) {
  //     Registry_instance = instance;
  //     return Registry_instance.getPDFAllCount.call({from: account});
  //   }).then(function (value) {
  //     console.log("waiting active uri requests:" + value);
  //     var balance_element = document.getElementById("activeRequestPDFs");
  //     balance_element.innerHTML = value;
  //   }).catch(function (e) {
  //     // console.log(e);
  //     self.setRegisterStatus("Unable to refresh balance; see log.",e);
  //   });
  // },



  addRequestPDF: function () {
    var self = this;
    var Registry_instance;
    var uri_requested_value = document.getElementById("uri_requested").value;
    console.log("addRequestPDF:"+uri_requested_value );
    return Registry.deployed()
    .then(function (instance) {
          Registry_instance = instance;
      
          return Registry_instance.requestPdf(uri_requested_value,{from: account});
          })
    .then(function (tx_id) {
          console.log(" uri request" + uri_requested_value + " added.txid:" + tx_id);
          // self.refreshBalance();
          })
    .catch(function (e) {

          console.log(e);
          self.setRegisterStatus("Unable to add request; see log.",e);

        })
  },




  signPdfGethttpHashTest:function (pdf_id,pdf_uri) {
    var self = this;



    self.signPdfGethttpHash(pdf_id,pdf_uri)
        .then(function(data){ console.log(JSON.parse(data));})
        .catch(function(error) { console.log("error"); console.log(error);})
  },

  signPdfGethttpHash:function (pdf_id,pdf_uri) {

      var options = {
        host: '52.59.219.164',
        // host: '0.0.0.0',
        port: 9080,
        path: '/remotesignhash?pdflocation=' + pdf_uri + '&id=' + pdf_id,
        // headers: headers
      };

    // return new Promise(function (resolve, reject) {
      //     resolve("http://52.59.219.164:9080/signed/pdf.pdf");
      //
      // });

      return new Promise(function (resolve, reject) {
        http.get(options, function (response) {
          response.setEncoding('utf8')
          response.on('error', function (e) {
            //do something with chunk
            var textChunk = chunk.toString('utf8');
            console.log("Got error: " + e);
            reject("Got error: " + e);
          });
          response.on('data', function (chunk) {
            if (response.statusCode == 200)
            {
              //do something with chunk
              // var textChunk = chunk.toString('utf8');
              console.log(chunk);
              console.log('after send');
              resolve(chunk);
            }
            else
            {
              console.log("Got error: " + chunk);
              reject(JSON.parse(chunk).message);
              // throws('can\'t sign pdf');
            }

          });
          // response.on('end', function (chank) {
          //   //do something with chunk
          //   // var textChunk = chunk.toString('utf8');
          //   console.log("Got error: " + chunk);
          //
          // });

        }).on("error", function (e) {
          console.log("Got error: " + e);
          reject("Got error: " + e);
           // throws('can\'t sign pdf');
        });
      });

  },



  signPDF: function (pdf_id,pdf_uri) {
    var self = this;
    var Registry_instance;
    var pdf_rec_index;
    var  _hash_num;
    var signed_pdf_uri;
    self.signPdfGethttpHash(pdf_id,pdf_uri)
        .then(function(data){
          var dataJson=JSON.parse(data);
          console.log("data",data);
          signed_pdf_uri=dataJson.filename;
          _hash_num =dataJson.hashcode;
          if (_hash_num)
          {
            _hash_num="0x"+_hash_num;
            console.log("_hash_num"+_hash_num)
          }
          else
          {
            console.log("else _hash_num"+_hash_num)
          }

          console.log("create contract:" +signed_pdf_uri + " uri:"+ pdf_uri.toString() + " index:" + pdf_id.valueOf() + " hash" + _hash_num);
          
          return Registry.deployed()
              .then(function (instance) {
                Registry_instance = instance;
                return Registry_instance.lookupid(pdf_uri,{from: account})
              })
              .then(function (response) {
                console.log("signPDF" + response);
                pdf_rec_index = response.valueOf();
                return Registry_instance.signPDF(pdf_rec_index, pdf_uri, signed_pdf_uri,_hash_num, {from: account , gas: 500000 });
              })
              .then(function (result) {

                console.log(result);

              })
              .catch(function (error) {
                console.log("error signature");
                // console.log(e);
                self.setRegisterStatus("Unable to sign pdf ; see log.", error);
              });

        })
        .catch(function(error) {
          console.log("error signature:" + error);
          // console.log(e);
          return Registry.deployed()
              .then(function (instance) {

                console.log("signerror sign PDF" );

                return instance.error(pdf_id,pdf_uri, "",error,{from: account,gas: 500000});
              })
              .then(function (result) {

                console.log(result);
                self.setRegisterStatus("Unable to sign pdf ; error is provided.");

              })
              .catch(function (error) {
                console.log("error signature");
                // console.log(e);
                self.setRegisterStatus("Unable to write error  ; see log.", error);
              });
        })

  },




  //
  // signDemoPDF: function () {
  //   var self = this;
  //   var Registry_instance;
  //   Registry.deployed().then(function (instance) {
  //     Registry_instance = instance;
  //     return Registry_instance.isPDFRequestExist("test", {from: account})
  //   })
  //       .then(function (response) {
  //         if (!response) {
  //           Registry_instance.addPDFRequest("test", {from: account});
  //         }
  //         return Registry_instance.getRegistryByURI("test", {from: account})
  //       })
  //      
  //       .then(function (response) {
  //         return (exampleContract.new("test", "0213213123"), response);
  //       })
  //       .then(function (pdfExtender, PDFs_index) {
  //         return Registry_instance.addPDF(pdfExtender.address, PDFs_index, {from: account});
  //       })
  //       .then(function (result) {
  //         console.log(" address" + new_PDF_address + " added");
  //         console.log(result.args());
  //         self.refreshBalance();
  //       })
  //       .catch(function (e) {
  //         console.error("error" + e);
  //       });
  // },


  startRequestListener: function (fromBlock) {
    var self = this;
    var Registry_instance;

    Registry.deployed().then(function (instance) {
      Registry_instance = instance;
      if(!fromBlock) {
        if (!latestWatched) {
          self.listSigned();
          console.log("latestWatched updated:" + latestWatched);
          fromBlock=latestWatched;

        }
        else {
          console.log("latestWatched:" + latestWatched);
          fromBlock=latestWatched;
        }
      }

      watcherReq = Registry_instance.RequestedPDF({}, {
        fromBlock: fromBlock.valueOf(),
        toBlock: 'latest'
      });
      watcherReq.watch(function (error, event) {

        if (!error) {


          if (event.blockNumber >= latestWatched) {
            console.log(event.args);
            console.log("in watcher requests");
            self.signPDF(event.args.PDFRequestindex,event.args.pdfURIaddress);


          }
          // self.refreshBalance();
          //
          // assert.equal(event.args.PDFRequestindex.valueOf(), sicle, "Event number should be 2");
          // // assert.equal(event.args.pdfURIaddress, "the_event_check_request", "Event number should be 2");

        } else {
          // console.log("error in request watcher");
          self.setRegisterStatus("Unable to watch events; see log.",error);

        }
        //once the event has been detected, take actions as desired
        //   var data = 'from: ' + response.args._from+"<br>candidateName: "+web3.toUtf8(response.args._candidateName) +"<br>";
        //  assert.equal(response, 1 , "Event number should be 1");

      })

    }).catch(function (error) {
      self.setRegisterStatus("Unable to watch events; see log.",error);

    });
  },


  stopRequestListener: function () {
    if (watcherReq != null)
      watcherReq.stopWatching();
  },

  setSignStatus: function(message) {
    var status = document.getElementById("SignStatus");
    status.innerHTML = message;
  },

  startSignListener: function (fromBlock) {
    var self = this;
    var Registry_instance;
    Registry.deployed().then(function (instance) {
      Registry_instance = instance;

      watcherSign = Registry_instance.UpdatePDF({}, {
        fromBlock: latestWatched.valueOf(),
        toBlock: 'latest'
      });
      watcherSign.watch(function (error, event) {

        if (!error) {
          console.log(event.args);
          console.log("in watcher sig");
          
          if (event.blockNumber >= latestWatched) {
            // self.refreshRegister();
            // self.setRegisterStatus(result.event);
            latestWatched = event.blockNumber;
          }
          // self.signPDF(event.args.pdfURIaddress);
          // self.refreshBalance();
          //
          // assert.equal(event.args.PDFRequestindex.valueOf(), sicle, "Event number should be 2");
          // // assert.equal(event.args.pdfURIaddress, "the_event_check_request", "Event number should be 2");

        } else {
          self.setRegisterStatus("Unable to watch events; see log.",error);

        }
        //once the event has been detected, take actions as desired
        //   var data = 'from: ' + response.args._from+"<br>candidateName: "+web3.toUtf8(response.args._candidateName) +"<br>";
        //  assert.equal(response, 1 , "Event number should be 1");

      })

    }).catch(function (error) {
      self.setRegisterStatus("Unable to watch events; see log.",error);

    });
  },

  stopSignListener: function () {
    if (watcherSign != null)
      watcherSign.stopWatching();
  },



    listRequests: function () {
    console.log("listrequest");
    var self = this;
    Registry.deployed().then(function (instance) {
      document.getElementById("activerequests").innerHTML = '';
      return instance.RequestedPDF({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
        for (var i = result.length - 1; i >= 0; i--) {
          var cur_result = result[i];
          self.listRequestsInner(cur_result);
        }
      });
    }).catch(function (error) {
      console.log("listrequest error"+error);
      self.setRegisterStatus("Unable to create  request list; see log.",error);

    })
  },

  listRequestsInner: function (result) {
    console.log("listRequestsInner");
    console.log(result.args);
    var _uri_address=result.args._uri;
    var _added_by=result.args._added_by;
    var _index_of_request=result.args.PDFRequestindex;
    document.getElementById("activerequests").innerHTML += '<h3><a href="' + _uri_address + '" target="_blank"> '+_uri_address+' added by ' + _added_by +' in place:' +_index_of_request+ '</a> '+   " <button onclick='App.signPDF("+_index_of_request+",\""+ _uri_address + "\")'>Sign</button></h3><br />";

  },

  setRegisterStatus: function(message,error) {
    console.log(error);
    var status = document.getElementById("registerStatus");
    status.innerHTML = message + " =>"+ error;
  },

  listSigned: function () {

    var self = this;
    var Registry_instance;
    document.getElementById("signedpdf").innerHTML = '';
    Registry.deployed().then(function (instance) {
      Registry_instance = instance;
      console.log("listSigned");
      return Registry_instance.SignedPDF({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
        for (var i = result.length - 1; i >= 0; i--) {
          var cur_result = result[i];
          self.listSignedInner(cur_result);
        }
      })
    }).catch(function (error) {
        self.setRegisterStatus("Unable to create signed pdfs list ; see log.", error);
      });
  },

  listSignedInner: function (result) {

    if ( !latestWatched || latestWatched<result.blockNumber)
    {
      latestWatched=result.blockNumber;
      console.log("latestWatched:",latestWatched);
    }
    else
    {
      console.log("latestWatched<result.blockNumber",latestWatched,result.blockNumber);
    }
    console.log(result.args.);
    var _PDFRequestindex=result.args.PDFRequestindex;
    var _uri=result.args._uri;
    var _signedUri=result.args._signedUri;
    var _hash=result.args._hash;
    document.getElementById("signedpdf").innerHTML += '<h3><a href="' + _signedUri +'" target="_blank"> ' +_signedUri + '</a></h3> biy place:'+_PDFRequestindex+' hash:'+ _hash+'<br />';

  },




  listErrors: function () {

    var self = this;
    var Registry_instance;
    document.getElementById("erroredpdf").innerHTML = '';
    Registry.deployed().then(function (instance) {
      Registry_instance = instance;
      return Registry_instance.RegistrarError({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
        for (var i = result.length - 1; i >= 0; i--) {
          var cur_result = result[i];
          self.listErrorsInner(cur_result);
        }
      })
    }).catch(function (error) {
      self.setRegisterStatus("Unable to create signed pdfs list ; see log.", error);
    });
  },

  listErrorsInner: function (result) {

    if ( !latestWatched || latestWatched<result.blockNumber)
    {
      latestWatched=result.blockNumber;
    }
    console.log(result.args);
    var _uri_address=result.args._uri;
    // var _added_by=result.args._added_by;
    var _index_of_request=result.args.PDFRequestindex;
    document.getElementById("erroredpdf").innerHTML += '<h3><a href="' + _uri_address + '" target="_blank"> '+_uri_address+'< in place:>' +_index_of_request+ '</a> '+"</h3><br />";


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
