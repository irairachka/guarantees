// var Registry = artifacts.require("./Registry.sol");
var GuaranteeConst = artifacts.require("./GuaranteeConst.sol");
var GuaranteeExtender = artifacts.require("./GuaranteeExtender.sol");
var GuaranteeRequestExtender = artifacts.require("./GuaranteeRequestExtender.sol");
var DigitalGuaranteeBNHP = artifacts.require("./DigitalGuaranteeBNHP.sol");
var GuaranteeRequest = artifacts.require("./GuaranteeRequest.sol");
var Regulator = artifacts.require("./Regulator.sol");

var account;
var chkguaranteeRequest;
var customerGuaranties = [];
var beneficiaries;
var customer;
var issuers;





contract('Regulator', function(accounts) {

    account=accounts[0];

    it("should be empty at the beginning", function() {
        return Regulator.deployed().then(function(instance) {
            return instance.getIssuerCounter.call();
        }).then(function(amount_issuer_counter) {
            assert.equal(amount_issuer_counter, 0, "Registry wasn't empty!");
        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });


    it("should create all data at the beginning", function() {
        var Registry_instance;
        return Regulator.deployed().then(function(instance) {
            Registry_instance = instance;
            return Registry_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            console.log("regulatorAddress:"+account);
            return Registry_instance.submitIssuer(account ,"בנק הפועלים","הנגב 11 תל-אביב",{from: account});
        }).then(function (result) {
            for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];

                if (log.event == "AddIssuer") {
                    // We found the event!
                    console.log("submitIssuer:");
                    console.log(log.args);
                    // break;
                    return Registry_instance.submitBeneficiary(account ,"Beneficiary 1","herzel 2 tel-aviv",{from: account});
            }
        }
        assert.fail("can't add issuer");
        // console.log(tx_id);
        }).then(function (result) {
            for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];

                if (log.event == "AddBeneficiary") {
                    // We found the event!
                    console.log("AddBeneficiary:");
                    console.log(log.args);
                    // break;
                    return Registry_instance.submitCustomer(account ,"customer 1","herzel 1 rishon-le-zion",{from: account});
                }
            }
            assert.fail("can't add Beneficiary");
        }).then(function (result) {
            for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];

                if (log.event == "AddCustomer") {
                    // We found the event!
                    console.log("AddCustomer:");
                    console.log(log.args);
                    // break;
                    return Registry_instance.getCustomer(account);
                }
            }
            // console.log("submitBeneficiary:");
            assert.fail("can't add customer");
            // return Registry_instance.getCustomer(account);
        }).then(function (customer) {
            console.log("customer",customer);

        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });

    it("should test  all data at the beginning", function() {
        var Registry_instance;
        return Regulator.deployed().then(function(instance) {
            Registry_instance = instance;
            return Registry_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            console.log("regulatorAddress:"+account);
            // return Registry_instance.getIssuer.call(account,{from: account});
            return getAllIssuers();
        }).then(function (result) {
            console.log("getIssuer:",result);
            assert.equal(result.length, 1, "getIssuer should have 1 parameter");
            return getAllBeneficiaries()
        }).then(function (result) {
            beneficiaries=result;
            console.log("getAllBeneficiaries:",result);
            assert.equal(result.length, 1, "getAllBeneficiaries should have 1 Beneficiaries");
            return getOneCustomer(account);
        }).then(function (result) {
            customer=result;
            console.log("getAllCustomers:",result);
            assert.equal(result.customerID, account, "getAllCustomer failed");
            return getAllIssuers()
        }).then(function (result) {
            issuers=result;
            console.log("getAllIssuers:",result);
            assert.equal(result.length, 1, "getAllIssuers should have 1 Issuers");

        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });
    

    function createRequestEt( userAccount , bankAccount, benefAccount , purpose,
                            amount, StartDate, EndDate, indexType, indexDate,proposalIPFSHash) {
        var StartDateEt=Math.floor((StartDate/1000));
        var EndDateEt=Math.floor((EndDate/1000));
        var purposeEt=web3.fromUtf8(purpose);
        var proposalIPFSHashEt='0x'.concat(proposalIPFSHash);

        return (GuaranteeRequest.new(bankAccount,benefAccount,purposeEt,amount,StartDateEt,EndDateEt,indexType, indexDate,proposalIPFSHashEt,{from: userAccount}));
    };

    function submitRequestEt( userAccount ,guaranteeRequestInstance ,comments,) {
        console.log("submitRequest:",userAccount,guaranteeRequestInstance.address);
        return guaranteeRequestInstance.submit(comments,{from: userAccount});
    };

    withdrawalRequestEt = (guaranteeRequestInstance, comments,userAccount) => {
        // let requestInstance = getGuaranteeRequestInstance(requestId);
        // console.log("withdrawal:", userAccount, guaranteeRequestInstance.address);
        return guaranteeRequestInstance.withdrawal(comments, {from: userAccount});
    };


    getGuaranteeRequestInstance=(requestAddress) =>
    {
        return GuaranteeRequest.at(requestAddress);
    };



    function addRequestEt( userAccount , reqaddress) {
        return Regulator.deployed().then(function(instance) {
            return instance.addGuaranteeRequest(reqaddress,{from: userAccount});
        }).catch(function(error) {
            throw error;
        });
    };

    function getRequestStateEt( userAccount , guaranteeRequestInstance) {
        return guaranteeRequestInstance.getRequestState.call({from: userAccount});
    };

    function getGuarantyStateEt( userAccount , guaranteeInstance) {
        return guaranteeInstance.getGuaranteeState.call({from: userAccount});
    };


    it("should create request ", function() {
       var Regulator_instance;
    return Regulator.deployed().then(function(instance) {
        Regulator_instance = instance;
        return Regulator_instance.getOwner.call();
    }).then(function (regulatorAddress) {
        account=regulatorAddress;
         console.log("regulatorAddress:",account);
        return createRequestEt(account,account,account," purpose test",1000,Date.now()/1000,Date.now()/1000+1000000,1,0,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2');
            // return Regulator_instance.addGuaranteeRequest(instance.address,{from: account});
      }).then(function (instance) {

            console.log("createRequest result",instance.address);

    }).catch(function(error) {

      console.error(error);
        assert.equal(error.toString(),'',
            'Error detected')
    });
  });


    it("should change state to (submit) request  and withdraw request ", function() {
        var Regulator_instance;
        var requestInstanceTmp;
        return Regulator.deployed().then(function(instance) {
            Regulator_instance = instance;
            return Regulator_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            console.log("regulatorAddress:",account);
            return createRequestEt(account,account,account," purpose test",1000,Date.now(),Date.now()+1000000,1,0,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2');
            // return Regulator_instance.addGuaranteeRequest(instance.address,{from: account});
        }).then(function (requestInstance) {
             if (requestInstance!=null) {
                 requestInstanceTmp=getGuaranteeRequestInstance(requestInstance.address);
                 console.log("createRequest 2 result", requestInstance.address);
                 return addRequestEt(account, requestInstance.address);
             }
             else {

                 throw "can't create request!";
             }
        }).then(function(result) {
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {

            assert.equal(result.valueOf(),0,
                'Error in submision getRequestState should be 0');
        // }).then(function(result) {
            return submitRequestEt(account,requestInstanceTmp,'');
        }).then(function(result) {
            // console.log("submitRequest 2 result :",result);

            // assert.equal(result.toString(),'true',
            //     'Error in submision detected')
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {
            // console.log("getRequestState  result :",result);

            assert.equal(result.valueOf(),1,
                'Error in submision detected')
            return withdrawalRequestEt(requestInstanceTmp ,'',account);
        }).then(function(result) {

            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {
            // console.log("getRequestState  result :",result);

            assert.equal(result.valueOf(),5,
                'Error in submision detected')

        }).catch(function(error) {

            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });



    function getOneRequest (requestAddress)  {
      /** Gets one guarantee requests by id */
      /** parses the data and sends to UI */
      return GuaranteeRequest.at(requestAddress)
        .then(function(guaranteeRequestinstance)  {
            console.log("getOneRequest:get data");
            return guaranteeRequestinstance.getGuaranteeRequestData.call();
        }).then(function(result) {
            console.log("getOneRequest:", result);
          return populateRequestData(result);
      })
    .catch(function(e)  {
        console.log(e);
      });
    };
    


    getBeneficiaryData = (id) => {
        return beneficiaries[0];
            // return populateBenefisiaryData([id,'test','addr test']);

    };

    getOneCustomerData= (id) => {
        return customer;
        // return populateBenefisiaryData([id,'test','addr test']);

    };


    function populateBenefisiaryData(benefisiaryID,resultArr)  {


        var ask= {
            beneficiaryID: benefisiaryID,
            Name: resultArr[0] ,
            Address: resultArr[1]
        };
        // console.log("request data:", ask);

        return ask;
    };
    
    function populateRequestData(resultArr)  {

        const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
      const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
    
      var ask= {
        GRequestID: resultArr[0],
        customer: resultArr[1],
        beneficiary: resultArr[2],
        bank: resultArr[3],
        beneficiaryName: getBeneficiaryData(resultArr[2]).name,
        purpose: resultArr[4],
        amount: resultArr[5].valueOf(),
        StartDate: startDate,
        EndDate: endDate,
        indexType: resultArr[8].valueOf(),
        indexDate: resultArr[9].valueOf(),
        requestState: resultArr[10].valueOf()
      };
         // console.log("request data:", ask);

        return ask;
    };

    function getAllBeneficiaries() {
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        customerGuaranties=[];
        return Regulator.deployed()
            .then(function (instance) {
                return instance.getBeneficiaryAddresses.call({from: this.account});
            }).then(function (beneficiaryAddresses) {
                console.log("beneficiaryAddresses[]:", beneficiaryAddresses);
                return Promise.all(beneficiaryAddresses.map((beneficiaryAddress) => {
                    return new Promise(resolve =>
                        getOneBeneficiary(beneficiaryAddresses).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            })
    };

    function getAllIssuers() {
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        issuers=[];
        return Regulator.deployed()
            .then(function (instance) {
                return instance.getIssuerAddressesList.call({from: this.account});
            }).then(function (issuersAddresses) {
                console.log("issuersAddresses[]:", issuersAddresses);
                return Promise.all(issuersAddresses.map((issuersAddress) => {
                    return new Promise(resolve =>
                        getOneIssuer(issuersAddresses).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            })
    };


    function getAllUserRequests() {
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        customerGuaranties=[];
        return Regulator.deployed()
            .then(function (instance) {
                return instance.getRequestAddressList.call({from: this.account});
            }).then(function (guaranteeAddresses) {
                 console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                }));
                

            }).catch(function (error) {
                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            })
        };
    // });

    function getOneBeneficiary (beneficiaryAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then(function (instance) {
                   return instance.getBeneficiary.call(beneficiaryAddress);
            }).then(function(result) {
                console.log("getBeneficiary:", result);
                return populateBenefisiaryData(beneficiaryAddress,result);
            })
            .catch(function(e)  {
                console.log(e);
            });
    };



    getOneCustomer =(customerAddress) => {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then(function (instance) {

                return instance.getCustomer.call(customerAddress);
            }).then(function(result) {
                console.log("getcustomer:", result);
                return populateCustomerAddressData(customerAddress,result);
            })
            .catch(function(e)  {
                console.log(e);
            });
    };

    function getAllUserGuarantees() {
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        customerGuaranties=[];
        return Regulator.deployed()
            .then(function (instance) {
                return instance.getGuaranteeAddressesList.call({from: this.account});
            }).then(function (guaranteeAddresses) {
                 console.log("guaranteeAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            })
    };

    function getOneGuarantee (requestAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return GuaranteeExtender.at(requestAddress)
            .then(function(guaranteeExtenderInstance)  {
                // console.log("getOneGuarantee:get data");
                return guaranteeExtenderInstance.getGuaranteeData.call();
            }).then(function(result) {
                 // console.log("getOneGuarantee:", result);
                return populateGuaranteeData(result);
            })
            .catch(function(e)  {
                console.log(e);
            });
    };


    function getOneIssuer (issuerAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        
        return Regulator.deployed()
            .then(function (instance) {
                return instance.getIssuer.call(issuerAddress);
            }).then(function(result) {
                console.log("getOneIssuer:", result);
                return populateIssuerAddressData(issuerAddress,result);
            })

            .catch(function(e)  {
                console.log(e);
            });
    };

    function populateIssuerAddressData(issuerId,resultArr)  {


        var ask= {
            bankID: issuerId,
            Name: resultArr[0] ,
            Address: resultArr[1]
        };

        // console.log("request data:", ask);

        return ask;
    };
    
    function populateCustomerAddressData(customerID,resultArr)  {

        
        var ask= {
            customerID: customerID,
            Name: resultArr[0],
            Address: resultArr[1]
        };

        // console.log("request data:", ask);

        return ask;
    };
        
    function populateGuaranteeData(resultArr)  {
        // console.log("populateGuaranteeData",resultArr);
        const startDate = (new Date(resultArr[7].valueOf() * 1000) ).toDateString();
        const endDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
        const indexDate=resultArr[10].valueOf();
        const proposal=web3.toUtf8( resultArr[5]);
        const state= resultArr[11].valueOf();
        var ask= {
            GuaranteeID: resultArr[0],
            GRequestID: resultArr[1],
            customer: resultArr[2],
            beneficiary: resultArr[4],
            bank: resultArr[3],
            customerName: getOneCustomerData(resultArr[2]).Name,
            StartDate: startDate,
            EndDate: endDate,
            amount: resultArr[6].valueOf(),
            purpose: proposal,
            indexType: resultArr[9].valueOf(),
            indexDate: indexDate.valueOf(),
            guaranteeState: state.valueOf()
        };


         console.log("populateGuaranteeData:", ask);

        return ask;
    };

    it("should check Requests array ", function() {
        getAllUserRequests()
           .then(function (result) {
                console.log("Requests list:",result);
               assert.equal(result[0].amount.valueOf(), 1000,
                   'Error detected')
            }).catch(function (error) {
                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            });
    });



    updateRequestEt = (guaranteeRequestInstance, comment ,state) => {
        // עדכון של בנק
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        return guaranteeRequestInstance.bankStateChange(comment,state);
    };

    rejectRequestEt = (guaranteeRequestInstance, comment) => {
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        return guaranteeRequestInstance.reject(comment);
    };

    acceptRequestEt = (requestId) => {
        // אישור של בנק
        // if  (hashcode) {
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        // return guaranteeRequestInstance.accept(comment)
        return Regulator.deployed()
            .then(function (instance) {
                console.log("acceptRequestEt requestId",requestId)
                return instance.acceptGuaranteeRequest(requestId);

            }).catch(function (error) {
                throw error;
            })

    };


    guaranteeSignCompliteEt = (requestId,guaranteeIPFSHash) => {
        // אישור של בנק
        // if  (hashcode) {
        var guaranteeIPFSHashEt='0x'.concat(guaranteeIPFSHash);

        return Regulator.deployed()
            .then(function (instance) {
                console.log("guaranteeSignCompliteEt requestId",requestId)
                return instance.GuaranteeSignComplite(requestId,guaranteeIPFSHashEt);

            }).catch(function (error) {
                throw error;
            })

    };

    terminateGuaranteeEt = (garantyId) => {

        return Regulator.deployed()
            .then(function (instance) {
                console.log("terminateGuaranteeEt garantyId",garantyId);
                return instance.terminateGuarantee(garantyId);
            }).catch(function (error) {
                throw error;
            })

    };

    changeGuaranteeEt = (gauranteeId,ammount,dateEnd) => {

        return Regulator.deployed()
            .then(function (instance) {
                console.log("acceptRequestEt requestId",gauranteeId)
                return instance.changeGuarantee(gauranteeId,ammount,dateEnd);
            }).catch(function (error) {
                throw error;
            })

    };

    terminateGuatantyEt = (guaranteeId, requestId) => {
        return Regulator.deployed().then(function(instance) {
            return instance.terminateGuarantee.call(requestId,guaranteeId,{from: userAccount})
        }).catch(function(error) {
            throw error;
        });

    };



    it("should change state to (update) request  and accept request ", function() {
        var Regulator_instance;
        var requestInstanceTmp;
        return Regulator.deployed().then(function(instance) {
            Regulator_instance = instance;
            return Regulator_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            console.log("regulatorAddress:",account);
            return createRequestEt(account,account,account," purpose test",1000,Date.now(),Date.now()+1000000,1,0,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2');
            // return Regulator_instance.addGuaranteeRequest(instance.address,{from: account});
        }).then(function (requestInstance) {
            if (requestInstance!=null) {
                requestInstanceTmp=getGuaranteeRequestInstance(requestInstance.address);
                console.log("createRequest 2 result", requestInstance.address);
                return addRequestEt(account, requestInstance.address);
            }
            else {

                throw "can't create request!";
            }
        }).then(function(result) {
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {

            assert.equal(result.valueOf(),0,
                'Error in submision getRequestState should be 0');
            // }).then(function(result) {
            return submitRequestEt(account,requestInstanceTmp,'');
        }).then(function(result) {
            // console.log("submitRequest 2 result :",result);

            // assert.equal(result.toString(),'true',
            //     'Error in submision detected')
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {
            // console.log("getRequestState  result :",result);

            assert.equal(result.valueOf(),1,
                'Error in submision detected')
            return updateRequestEt(requestInstanceTmp ,' comment',2);
        }).then(function(result) {

            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {
            // console.log("getRequestState  result :",result);

            assert.equal(result.valueOf(),2,
                'Error in change state detected')
            // console.log("getRequestState  result :",result);
            //     return requestInstanceTmp.accept();
            return acceptRequestEt(requestInstanceTmp.address );
        }).then(function(result) {

            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {
            // console.log("getRequestState  result :",result);

            assert.equal(result.valueOf(),6,
                'Error in accept detected')

        }).catch(function(error) {

            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });

    it("should create  guarantee ", function() {
        var Regulator_instance;
        var requestInstanceTmp;
        return Regulator.deployed().then(function(instance) {
            Regulator_instance = instance;
            return Regulator_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            console.log("regulatorAddress:",account);
            return createRequestEt(account,account,account," purpose test",1000,Date.now()/1000,Date.now()/1000+10000,1,0,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2');
            // return Regulator_instance.addGuaranteeRequest(instance.address,{from: account});
        }).then(function (requestInstance) {
            if (requestInstance!=null) {
                requestInstanceTmp=getGuaranteeRequestInstance(requestInstance.address);
                console.log("createRequest 2 result", requestInstance.address,requestInstanceTmp.address);
                return addRequestEt(account, requestInstance.address);
            }
            else {

                throw "can't create request!";
            }
        }).then(function(result) {
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result) {

            assert.equal(result.valueOf(),0,
                'Error in submision getRequestState should be 0');
            // }).then(function(result) {
            return submitRequestEt(account,requestInstanceTmp,'');
        }).then(function(result) {
            // console.log("submitRequest 2 result :",result);

            // assert.equal(result.toString(),'true',
            //     'Error in submision detected')
            return getRequestStateEt(account,requestInstanceTmp);
        }).then(function(result1) {
            console.log("getRequestState  result :",result1);
            return acceptRequestEt(requestInstanceTmp.address );
        }).then(function(result2) {
            console.log("before guaranteeSignCompliteEt:",result2);
            return guaranteeSignCompliteEt(requestInstanceTmp.address,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001');
        }).then(function(result3) {
            console.log("getRequestState  result3 :",result3);
            for (var i = 0; i < result3.logs.length; i++) {
                var log = result3.logs[i];

                if (log.event == "GuarantieSigned") {
                    // We found the event!
                    console.log("GuarantieSigned:",log.args);

                    // break;
                    return   getAllUserGuarantees();
                }

            }

            return   getAllUserGuarantees();

            // console.log("getRequestState  result :",result);
            // return aaa(requestInstanceTmp.address,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001');

        }).then(function (result) {
            console.log("getAllUserGuarantees  result :",result);
            assert.equal(result[0].amount.valueOf(), 1000,
                        'Error detected')

        }).catch(function(error) {

            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });

    it("should  check change  guarantee ", function() {
            var Regulator_instance;
            var requestInstanceTmp;
            return Regulator.deployed().then(function (instance) {
                Regulator_instance = instance;
                return Regulator_instance.getOwner.call();
            }).then(function (regulatorAddress) {
                account = regulatorAddress;

                // console.log("getRequestState  result :",result);
                // return aaa(requestInstanceTmp.address,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001');
                return getAllUserGuarantees();
            }).then(function (result) {
                        console.log("guarentees list before change:", result);console.log("guarentees list: after terminate", result);
                        assert.equal(result[0].guaranteeState.valueOf(), 1,"the state is invalid");

                return changeGuaranteeEt(result[0].GuaranteeID, 25550,  Date.now()/1000 + 222000);
            }).then(function (result) {
                console.log("guarentees list after change:", result);
                return getAllUserGuarantees();
            }).then(function (result) {
                console.log("guarentees list before change:", result);
                assert.equal(result[0].guaranteeState.valueOf(), 1,"the state is invalid");
                return getAllUserRequests();
            }).then(function (result) {
                console.log("guarentees list before change:", result);
                assert.equal(result[0].guaranteeState.valueOf(), 1,"the state is invalid");

            }).catch(function (error) {

                console.error(error);
                assert.equal(error.toString(), '',
                    'Error detected')
            });
        });

    it("should  terminate  guarantee ", function() {
        var Regulator_instance;
        var requestInstanceTmp;
        return Regulator.deployed().then(function(instance) {
            Regulator_instance = instance;
            return Regulator_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;

            // console.log("getRequestState  result :",result);
            // return aaa(requestInstanceTmp.address,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001');
           return  getAllUserGuarantees();
        }).then(function (result) {
                console.log("guarentees list before terminate:",result);
                assert.equal(result[0].amount.valueOf(), 1000,
                    'Error detected')
            return terminateGuaranteeEt(result[0].GuaranteeID);

        }).then(function(result) {
            console.log("terminateGuaranteeEt  result :", result);
            // return aaa(requestInstanceTmp.address,'e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001');
            return getAllUserGuarantees();

        }).then(function (result) {
            console.log("guarentees list: after terminate", result);
            assert.equal(result[0].guaranteeState.valueOf(), 3,
                'Error detected in terminate state');
            // var dt = (Date.now() / 1000);
            // return changeGuaranteeEt(result[1].GuaranteeID, 25550, dt, dt + 10000);



        }).catch(function(error) {

            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });

    







    // it("should change state to (wait for a customer ) ", function() {
    //     var Regulator_instance;
    //     var guaranteeRequest_instance;
    //     var requestAddress;
    //     return Regulator.deployed().then(function(instance) {
    //         Regulator_instance = instance;
    //         return Regulator_instance.getOwner.call();
    //     }).then(function (regulatorAddress) {
    //         account=regulatorAddress;
    //         return Regulator_instance.getRequestsAddress.call();
    //     }).then(function (guaranteeRequestAddresses) {
    //         requestAddress=guaranteeRequestAddresses[0];
    //         console.log("guaranteeRequestAddresses:"+requestAddress);
    //         // console.log(typeof(guaranteeRequestAddresses[0]));
    //         var guaranteeRequest= GuaranteeRequest.at(requestAddress);
    //         guaranteeRequest.then(function(guaranteeRequestinstance) {
    //             guaranteeRequest_instance=guaranteeRequestinstance;
    //             return guaranteeRequest_instance.getId.call();
    //         }).then(function (guaranteeRequestAddressesAt) {
    //             assert.equal(guaranteeRequestAddressesAt, requestAddress, "Addresses is not equal!");
    //             return guaranteeRequest_instance.getRequestState.call();
    //         }).then(function (guaranteestate) {
    //             console.log("guaranteestate result:");
    //             console.log(guaranteestate);
    //             assert.equal(guaranteestate.valueOf(), 1, "State should be 1 (created)!");
    //             return guaranteeRequest_instance.getGuaranteeRequestData();
    //         }).then(function (result) {
    //
    //             console.log("getGuaranteeRequestData result for type:"+ typeof(result));
    //             console.log(result);
    //             console.log(result[0],result[2],result[3],result[4],result[5] );
    //             console.log(typeof(result[6]) );
    //             return guaranteeRequest_instance.bankStateChange("bankStateChange test.",3,{from: account});
    //         }).then(function (bankStateChangeed) {
    //             for (var i = 0; i < bankStateChangeed.logs.length; i++) {
    //                 var log = bankStateChangeed.logs[i];
    //
    //                 if (log.event == "BankStateChange") {
    //                     // We found the event!
    //                     console.log("BankStateChanged:");
    //                     console.log(log.args);
    //                     // break;
    //                     return guaranteeRequest_instance.getRequestState.call();
    //                 }
    //             }
    //             console.log("check for bankStateChange:");
    //             console.log(bankStateChangeed);
    //             assert.equal(bankStateChangeed.valueOf(), true, "bankStateChangeed wasn't true!");
    //             return guaranteeRequest_instance.getRequestState.call();
    //         }).then(function (result) {
    //             console.log(result.toString());
    //             console.log("guaranteestate result:");
    //             console.log(result);
    //             assert.equal(result.valueOf(), 3, "State should be 3 (changed to wait for customer)!");
    //
    //         }).catch(function(error) {
    //             console.error(error);
    //             assert.equal(error.toString(),'',
    //                 'Error detected')
    //         });
    //
    //     }).catch(function(error) {
    //         console.error(error);
    //         assert.equal(error.toString(),'',
    //             'Error detected')
    //     });
    // });

    
    //
    // it("should create and change state to reject ", function() {
    //     var Regulator_instance;
    //     var guaranteeRequest_instance;
    //     var requestAddress;
    //     return Regulator.deployed().then(function(instance) {
    //         Regulator_instance = instance;
    //         return Regulator_instance.getOwner.call();
    //     }).then(function (regulatorAddress) {
    //         account=regulatorAddress;
    //         console.log("regulatorAddress:"+account);
    //
    //
    //         return Regulator_instance.createGuaranteeRequest.call(account ,account,account,"_purpose 1", 1000, dt,dt+1000000,1,0,{from: account});
    //     }).then(function (guaranteeRequestAddresses) {
    //         requestAddress=guaranteeRequestAddresses;
    //         console.log("guaranteeRequestAddresses:"+requestAddress);
    //         var guaranteeRequest= GuaranteeRequest.at(requestAddress);
    //         guaranteeRequest.then(function(guaranteeRequestinstance) {
    //             guaranteeRequest_instance=guaranteeRequestinstance;
    //             return guaranteeRequest_instance.getId.call();
    //         }).then(function (guaranteeRequestAddressesAt) {
    //             assert.equal(guaranteeRequestAddressesAt, requestAddress, "Addresses is not equal!");
    //             return guaranteeRequest_instance.getRequestState.call();
    //         }).then(function (guaranteestate) {
    //             console.log("guaranteestate result:");
    //             console.log(guaranteestate);
    //             assert.equal(guaranteestate.valueOf(), 1, "State should be 1 (created)!");
    //             return guaranteeRequest_instance.getGuaranteeRequestData();
    //         }).then(function (result) {
    //
    //             console.log("getGuaranteeRequestData result for type:"+ typeof(result));
    //             console.log(result);
    //             console.log(result[0],result[2],result[3],result[4],result[5] );
    //             console.log(typeof(result[6]) );
    //
    //             return guaranteeRequest_instance.reject("test submit.",{from: account});
    //         }).then(function (rejected) {
    //             for (var i = 0; i < rejected.logs.length; i++) {
    //                 var log = rejected.logs[i];
    //
    //                 if (log.event == "Rejected") {
    //                     // We found the event!
    //                     console.log("Rejected:");
    //                     console.log(log.args);
    //                     // break;
    //                     return guaranteeRequest_instance.getRequestState.call();
    //                 }
    //             }
    //             console.log("check for submited:");
    //             console.log(rejected);
    //             assert.equal(rejected.valueOf(), true, "rejected wasn't true!");
    //             return guaranteeRequest_instance.getRequestState.call();
    //         }).then(function (result) {
    //             console.log(result.toString());
    //             // for (var i = 0; i < result.logs.length; i++) {
    //             //     var log = result.logs[i];
    //             //
    //             //     if (log.event == "State") {
    //             //         // We found the event!
    //             //         console.log("State:");
    //             //         console.log(log.args);
    //             //         // break;
    //             //     }
    //             // }
    //             console.log("guaranteestate result:");
    //             console.log(result);
    //             assert.equal(result.valueOf(), 8, "State should be 8 (rejecteded)!");
    //
    //         }).catch(function(error) {
    //             console.error(error);
    //             assert.equal(error.toString(),'',
    //                 'Error detected')
    //         });
    //
    //     }).catch(function(error) {
    //         console.error(error);
    //         assert.equal(error.toString(),'',
    //             'Error detected')
    //     });
    // });




});

