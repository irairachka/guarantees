// var Registry = artifacts.require("./Registry.sol");
var GuaranteeConst = artifacts.require("./GuaranteeConst.sol");
var GuaranteeExtender = artifacts.require("./GuaranteeExtender.sol");
var GuaranteeRequestExtender = artifacts.require("./GuaranteeRequestExtender.sol");
var DigitalGuaranteeBNHP = artifacts.require("./DigitalGuaranteeBNHP.sol");
var GuaranteeRequest = artifacts.require("./GuaranteeRequest.sol");
var Regulator = artifacts.require("./Regulator.sol");

var account;







contract('Regulator', function(accounts) {

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
            console.log("customer");
            console.log(customer);

        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });



    it("should create request ", function() {
       var Regulator_instance;
    return Regulator.deployed().then(function(instance) {
        Regulator_instance = instance;
        return Regulator_instance.getOwner.call();
    }).then(function (regulatorAddress) {
        account=regulatorAddress;
         console.log("regulatorAddress:"+account);
        // var timestamp = 1301090400,
        // date = new Date(timestamp * 1000),
        // datevalues = [
        //     date.getFullYear(),
        //     date.getMonth()+1,
        //     date.getDate(),
        //     date.getHours(),
        //     date.getMinutes(),
        //     date.getSeconds(),
        // ];
        var dt=(Date.now()/1000);

        return Regulator_instance.createGuaranteeRequest(account ,account,account,"_purpose 1", 1000, dt,dt+1000000,1,0,{from: account});
    }).then(function (result) {
        for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];

            if (log.event == "GuaranteeRequestCreated") {
                // We found the event!
                console.log("createGuaranteeRequest:");
                console.log(log.args);
                // break;
                return Regulator_instance.getAcctiveRequestsAddress.call();
            }
        }
        console.log("AddCustomer error:");
        console.log(result);
        assert.fail("can't create request customer");

        // console.log("create GuaranteeRequest Address:");
        // console.log(guaranteeRequestAddress);

    }).then(function (guaranteeRequestAddresses) {
        console.log("guaranteeRequestAddresses:"+guaranteeRequestAddresses);
    }).catch(function(error) {
      console.error(error);
        assert.equal(error.toString(),'',
            'Error detected')
    });
  });


    it("should change state to (submit) request  ", function() {
        var Regulator_instance;
        var guaranteeRequest_instance;
        var requestAddress;
        return Regulator.deployed().then(function(instance) {
            Regulator_instance = instance;
            return Regulator_instance.getOwner.call();
        }).then(function (regulatorAddress) {
            account=regulatorAddress;
            return Regulator_instance.getAcctiveRequestsAddress.call();
        }).then(function (guaranteeRequestAddresses) {
            requestAddress=guaranteeRequestAddresses[0];
            console.log("guaranteeRequestAddresses:"+requestAddress);
            // console.log(typeof(guaranteeRequestAddresses[0]));
            var guaranteeRequest= GuaranteeRequest.at(requestAddress);
            guaranteeRequest.then(function(guaranteeRequestinstance) {
                guaranteeRequest_instance=guaranteeRequestinstance;
                return guaranteeRequest_instance.getId.call();
        }).then(function (guaranteeRequestAddressesAt) {
            assert.equal(guaranteeRequestAddressesAt, requestAddress, "Addresses is not equal!");
            return guaranteeRequest_instance.getRequestStateTranslated.call();
        }).then(function (guaranteestate) {
            console.log("guaranteestate result:");
            console.log(guaranteestate);
            assert.equal(guaranteestate.valueOf(), 0, "State should be 0 (created)!");
            return guaranteeRequest_instance.getGuaranteeRequestData();
        }).then(function (result) {

            console.log("getGuaranteeRequestData result for type:"+ typeof(result));
            console.log(result);
            console.log(result[0],result[2],result[3],result[4],result[5] );
            console.log(typeof(result[6]) );
            return guaranteeRequest_instance.submit("test submit.",{from: account});
        }).then(function (submited) {
                for (var i = 0; i < submited.logs.length; i++) {
                    var log = submited.logs[i];

                    if (log.event == "Submitted") {
                        // We found the event!
                        console.log("submited:");
                        console.log(log.args);
                         // break;
                        return guaranteeRequest_instance.getRequestStateTranslated.call();
                    }
                }
            console.log("check for submited:");
            console.log(submited);
            assert.equal(submited.valueOf(), true, "submited wasn't true!");
            return guaranteeRequest_instance.getRequestStateTranslated();
        }).then(function (result) {
                console.log(result.toString());
                // for (var i = 0; i < result.logs.length; i++) {
                //     var log = result.logs[i];
                //
                //     if (log.event == "State") {
                //         // We found the event!
                //         console.log("State:");
                //         console.log(log.args);
                //         // break;
                //     }
                // }
                console.log("guaranteestate result:");
                console.log(result);
                assert.equal(result.valueOf(), 1, "State should be 1 (submited)!");

        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });

        }).catch(function(error) {
            console.error(error);
            assert.equal(error.toString(),'',
                'Error detected')
        });
    });



    // it("should change state to wait for a customer ()  ", function() {
    //     var Regulator_instance;
    //     var guaranteeRequest_instance;
    //     var requestAddress;
    //     return Regulator.deployed().then(function(instance) {
    //         Regulator_instance = instance;
    //         return Regulator_instance.getOwner.call();
    //     }).then(function (regulatorAddress) {
    //         account=regulatorAddress;
    //         return Regulator_instance.getAcctiveRequestsAddress.call();
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
    //             return guaranteeRequest_instance.getRequestStateTranslated.call();
    //         }).then(function (guaranteestate) {
    //             console.log("guaranteestate result:");
    //             console.log(guaranteestate);
    //             assert.equal(guaranteestate.valueOf(), 1, "State should be 1 (created)!");
    //             return guaranteeRequest_instance.getGuaranteeRequestData.call();
    //         }).then(function (result) {
    //             console.log("guaranteeRequest result for type:"+ typeof(result));
    //             console.log(result);
    //             return guaranteeRequest_instance.bankStateChange("bankStateChange test.",3,{from: account});
    //         }).then(function (result) {
    //             for (var i = 0; i < result.logs.length; i++) {
    //                 var log = result.logs[i];
    //
    //                 if (log.event == "BankStateChange") {
    //                     // We found the event!
    //                     console.log("BankStateChange:");
    //                     console.log(log.args);
    //                     return guaranteeRequest_instance.getRequestStateTranslated.call();
    //                 }
    //             }
    //             // console.log("check for submited:");
    //             // console.log(submited);
    //             // assert.equal(submited.valueOf(), true, "submited wasn't true!");
    //             assert.fail("can't run bankStateChange ");
    //
    //         }).then(function (guaranteestate) {
    //             console.log("guaranteestate result:");
    //             console.log(guaranteestate);
    //             assert.equal(guaranteestate.valueOf(), 3, "State should be 3 (submited)!");
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

