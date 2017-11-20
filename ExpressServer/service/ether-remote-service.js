// import { Injectable, isDevMode } from '@angular/core';
// import {MessageService} from "primeng/components/common/messageservice";
// import {
//     mockCustomerRequests, mockcustomers, mockCustomerGuaranties, bankData,
//     mockBankRequests, mockBankGuaranties, mockbeneficiaries, mockexpandedRequest
// } from "../../../tempData/mockData";
// import {Beneficiary, Customer, Guarantee,GRequest} from "../interfaces/request";
// import {Observable} from "rxjs/Rx";
// import {GuaranteeState, RequestState} from "../interfaces/enum";
// import {MockService} from "./mock-etherium.service";
// Import our contract artifacts and turn them into usable abstractions.

const Web3 = require('web3');
const contract = require('truffle-contract');

const GuaranteeRequest_artifact = require('../../build/contracts/GuaranteeRequest.json');
const Regulator_artifact = require('../../build/contracts/Regulator.json');
const DigitalGuaranteeBNHP_artifact = require('../../build/contracts/DigitalGuaranteeBNHP.json');
const GuaranteeRequestExtender_artifact = require('../../build/contracts/GuaranteeRequestExtender.json');
const GuaranteeExtender_artifact = require('../../build/contracts/GuaranteeExtender.json');
const ChangeGuaranteeRequest_artifact = require('../../build/contracts/ChangeGuaranteeRequest.json');



let Regulator = contract(Regulator_artifact);
let GuaranteeRequest = contract(GuaranteeRequest_artifact);
let DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);
let GuaranteeExtender = contract(GuaranteeExtender_artifact);
let GuaranteeRequestExtender = contract(GuaranteeRequestExtender_artifact);
let ChangeGuaranteeRequest= contract(ChangeGuaranteeRequest_artifact);


let accounts;
let account;
let web3;
let realCustomers = [];
let realBeneficiaries=[];
let realIssuers=[];
 
class RealService {

    constructor() {
        this.checkAndInstantiateWeb3();
        this.onReady();

    }

/** ******************** **/
/**  Setup Functions     **/
/** ******************** **/

    checkAndInstantiateWeb3  ()  {
        if (typeof this.web3 !== 'undefined') {
            console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
    };

onReady () {
    Regulator.setProvider(this.web3.currentProvider);
    GuaranteeRequest.setProvider(this.web3.currentProvider);
    DigitalGuaranteeBNHP.setProvider(this.web3.currentProvider);
    GuaranteeExtender.setProvider(this.web3.currentProvider);
    GuaranteeRequestExtender.setProvider(this.web3.currentProvider);
    ChangeGuaranteeRequest.setProvider(this.web3.currentProvider);


    this.web3.eth.getAccounts(function(err, accs)  {
        if (err != null) {
            return;
        }

        if (accs.length === 0) {
            alert(
                'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
        }
        accounts = accs;
        account = accounts[0];
        console.log('this.accounts',accounts)
        /** Part of original truffle **/
        // This is run from window:load and ZoneJS is not aware of it we
        // need to use _ngZone.run() so that the UI updates on promise resolution
        // this._ngZone.run(() => {
        //   this.getAllUserRequests();
        // });
    });
};

    checkService(customerAddress=this.account)
    {
        return "=>Ok for :"+customerAddress;
    }

/************************/
/**  replaced   ****/
/************************/

    getAllGuaranties (customerAddress=this.account)  {
        // if (this.realGuarantees==null) {
        return new Promise((resolve, reject)=> {
            this.getAllUserGuarantees(customerAddress).then((GuarantiesEt)=> {
                // this.realGuarantees = [...mockCustomerGuaranties, ...GuarantiesEt];
                // super.setMockGuarantee(this.realGuarantees);
                resolve([ ...GuarantiesEt]);
            }).catch((error)=> {
                console.error(error);
                reject(error);
            });
        })
        // }
        // else
        //   new Promise((resolve, reject)=> {
        //     resolve(this.mockGuarantees);
        //   });

    };




    getBeneficiaryEt (beneficiaryAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then( (instance)=> {

                return instance.getBeneficiary.call(beneficiaryAddress);
            }).then((result)=> {
                console.log("getcustomer:", result);
                return this.populateBeneficiaryData(beneficiaryAddress,result);
            })
            .catch(function(error)  {
                console.error(error);
            });
    };


    populateBeneficiaryData (benefisiaryID,resultArr)  {


        var ask= {
            beneficiaryID: benefisiaryID,
            Name: resultArr[0] ,
            Address: resultArr[1]
        };
        // console.log("request data:", ask);

        return ask;
    };



    getOneCustomerDataP  (customerAddress)  {
        return new Promise((resolve, reject)=> {
            for (var i in realCustomers) {
                if (realCustomers[i].customerID == customerAddress) {
                    resolve(realCustomers[i]);
                }
            }

            this.getOneCustomerEt(customerAddress).then((loadedCustomer)=> {
                console.log('loadedCustomer',loadedCustomer);
                realCustomers = [...realCustomers, loadedCustomer];
                resolve(loadedCustomer);
            }).catch((error)=> {
                console.error(error);

                reject(error);
            });

        });
    };

    getOneCustomerEt  (customerAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then( (instance)=> {

                return instance.getCustomer.call(customerAddress);
            }).then((result)=> {
                console.log("getcustomer:", result);
                return this.populateCustomerAddressData(customerAddress,result);
            })
            .catch(function(error)  {
                console.error(error);
            });
    };

    populateCustomerAddressData (customerID,resultArr)  {


        var ask= {
            customerID: customerID,
            Name: resultArr[0],
            Address: resultArr[1]
        };

        // console.log("request data:", ask);

        return ask;
    };



    getAllUserGuarantees(customerAddress=this.account) {
        /** Gets all guarantee requests for customer */
        let customerGuaranties=[];
        return Regulator.deployed()
            .then( (instance)=> {
                return instance.getGuaranteeAddressesList.call({from: customerAddress});
            }).then( (guaranteeAddresses) =>{
                console.log("guaranteeAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                console.error(error);
                throw error;
            })
    };

    getOneGuarantee (requestAddress,customerAddress=this.account)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return GuaranteeExtender.at(requestAddress)
            .then((guaranteeExtenderInstance)=>  {
                // console.log("getOneGuarantee:get data");
                return guaranteeExtenderInstance.getGuaranteeData.call({from:customerAddress});
            }).then((result) =>{
                // console.log("getOneGuarantee:", result);
                return this.populateGuaranteeDataP(result);
            }).then((result) =>{
                return result;
            })
            .catch(function(error)  {
                console.error(error);
                throw error;
            });
    };





// getAllGuaranties  ()  {
//     return new Promise(resolve => {
//         resolve([
//             {
//                 EndDate: "10/05/2019",
//                 GRequestID: "0xd532D3531958448e9E179729421B92962fb81Dd1",
//                 GuaranteeID: "0xd532D3531958448e9E179729421B92962fb81Dc1",
//                 StartDate: "10/05/2017",
//                 amount: 10000,
//                 bank: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
//                 beneficiary: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
//                 customer: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
//                 customerName: "ישראל ישראלי",
//                 fullName: "ישראל ישראלי",
//                 guaranteeState: 1,
//                 indexDate: 1,
//                 indexType: 1,
//                 purpose: "מכרז נקיון"
//             }
//         ]);
//     })
//
// };

    transformDateSolToJS  (longDate)  {
        const date = new Date(longDate * 1000);
        return date.toLocaleDateString('en-GB');
    };


    populateGuaranteeDataP (resultArr)  {

        return new Promise((resolve, reject)=> {

            const startDatet = this.transformDateSolToJS(resultArr[8].valueOf());
            const endDatet = this.transformDateSolToJS(resultArr[9].valueOf());

            // console.log("dates",resultArr[8].valueOf(),startDatet,resultArr[9].valueOf(),endDatet);
            // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
            // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
            const indexDate = resultArr[11].valueOf();
            const proposal = this.web3.toUtf8(resultArr[6]);
            const full_name = this.web3.toUtf8(resultArr[5]);
            const state = resultArr[12].valueOf();
             console.log("state",state,resultArr);

            this.getOneCustomerDataP(resultArr[2]).then((customer)=> {


                var ask = {
                    GuaranteeID: resultArr[0],
                    GRequestID: resultArr[1],
                    customer: resultArr[2],
                    beneficiary: resultArr[4],
                    bank: resultArr[3],
                    customerName: customer.Name,
                    StartDate: startDatet,
                    EndDate: endDatet,
                    amount: parseInt(resultArr[7].valueOf()),
                    fullName: full_name,
                    purpose: proposal,
                    indexType: parseInt(resultArr[10].valueOf()),
                    indexDate: parseInt(indexDate.valueOf()),
                    guaranteeState: parseInt(state.valueOf())
                };


                // console.log("populateGuaranteeData:", ask);

                resolve(ask);
            }).catch((error)=> {
                console.error(error);
                reject(error);
            });
        });
    };


    terminateGuatanty  (guaranteeId, requestId, comment , hashcode,customerAddress=this.account)  {
        return new Promise((resolve, reject)=> {
            console.log('terminateGuatanty',requestId);
            this.terminateGuaranteeEt(guaranteeId,customerAddress).then((result) => {
                console.log(result);
                resolve( true);

            }).catch((error)=> {
                console.error(error);
                reject(error);

            })
        })
    };

    terminateGuaranteeEt  (garantyId,customerAddress=this.account)  {

        return Regulator.deployed()
            .then( (instance) =>{
                console.log("terminateGuaranteeEt garantyId",garantyId,"from: account-",account);
                return instance.terminateGuarantee(garantyId ,{from:customerAddress});
            }).catch(function (error) {
                console.error(error);
                throw error;
            })

    };

    // guaranteeUpdate  (guatantyId, requestId, comment, amount, date,customerAddress=this.account)  {
    //     return new Promise((resolve, reject)=> {
    //         resolve(Math.random()*1234567892345123);
    //     });
    // };


    transformDateJSToSol  (caldate)  {
        var soltime = Date.parse(caldate)/1000;
        if (isNaN(soltime) )
        {
            var thDate=caldate.split("/");
            if (thDate.length<3)
                thDate=caldate.split("-");
            var newDate=thDate[1]+"/"+thDate[0]+"/"+thDate[2];
            soltime = (new Date(newDate).getTime()/1000);

        }

        console.log('transformDateJSToSol',caldate,Date.parse(caldate),caldate.split("/"),caldate.split("-"),soltime);

        return Math.floor(soltime);

    };



    guaranteeUpdate (guatantyId, requestId, comment, amount, date,customerAddress=this.account) {
        return new Promise((resolve, reject)=> {
            this.changeGuaranteeEt(customerAddress,guatantyId,amount,this.transformDateJSToSol(date) ).then((newRequestAddress) => {

                resolve(""+newRequestAddress);

            }).catch((error)=> {
                console.error('error',error);

                reject(error);


            })
        });
    };


    changeGuaranteeEt  (userAccount ,guaranteeId , amount,  EndDate)  {

        // var EndDateEt=Math.floor((EndDate/1000));
        var Regulator_instance,ChangeGuaranteeRequestinstanceAddress;

        return Regulator.deployed()
            .then( (instance) => {
                Regulator_instance=instance;
                console.log("change  guaranteeId", guaranteeId);
                return ChangeGuaranteeRequest.new(guaranteeId, amount, EndDate,{gas:5900000,from: userAccount});
            })
            .then( (ChangeGuaranteeRequestinstance) => {
                // console.log("change  guaranteeId ChangeGuaranteeRequestinstance", ChangeGuaranteeRequestinstance.address,ChangeGuaranteeRequestinstance)
                ChangeGuaranteeRequestinstanceAddress=ChangeGuaranteeRequestinstance.address;
                return Regulator_instance.changeGuaranteeM(ChangeGuaranteeRequestinstanceAddress,{from: userAccount});
            })
            .then( (tx) =>{
                return new Promise((resolve)=> {
                    console.log("  ChangeGuaranteeRequestinstanceAddress", ChangeGuaranteeRequestinstanceAddress)
                    resolve(ChangeGuaranteeRequestinstanceAddress);
                })
            }).catch( (error) =>{
                console.error(error);
                throw error;
            })

    };


    getOneRequest (requestAddress,customerAddress=this.account)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        console.log('test');
        return GuaranteeRequest.at(requestAddress)
            .then((guaranteeRequestinstance)=>  {
                // console.log("getOneRequest:get data");
                console.log('test1');
                return guaranteeRequestinstance.getGuaranteeRequestData.call({from:customerAddress});
            }).then((result) =>{
                // console.log("getOneRequest:", result[7].valueOf(),result[8].valueOf());
                return this.populateRequestDataP(result);
            }).then((result) =>{
                return result;
            })
            .catch(function(error)  {
                console.log('hello');
                console.error(error);
                throw error;
            });
    };

    populateRequestDataP(resultArr)  {
        return  new Promise((resolve,reject) =>
        {

            const startDate = this.transformDateSolToJS(resultArr[7].valueOf());
            const endDate = this.transformDateSolToJS(resultArr[8].valueOf());

            // const startDate = (new Date(resultArr[6] * 1000) ).toDateString();
            // const endDate = (new Date(resultArr[7] * 1000) ).toDateString();
            //  console.log('startDate1',resultArr[7] * 1000,startDate,'endDate1',resultArr[8] * 1000,endDate);
            const proposal=this.web3.toUtf8( resultArr[5]);
            const full_name=this.web3.toUtf8( resultArr[4]);
            const ischangeRequest=(resultArr[12] === 'true' || resultArr[12] == true);
            const changeRequestId=(resultArr[13] !== undefined ? resultArr[13] : '') ;

            this.getOneCustomerDataP(resultArr[2]).then((beneficiary)=> {

                var ask = {
                    GRequestID: resultArr[0],
                    customer: resultArr[1],
                    beneficiary: resultArr[2],
                    bank: resultArr[3],
                    beneficiaryName: beneficiary.Name,
                    fullName: full_name,
                    purpose: proposal,
                    amount: parseInt(resultArr[6].valueOf()),
                    StartDate: startDate,
                    EndDate: endDate,
                    indexType: parseInt(resultArr[9].valueOf()),
                    indexDate: parseInt(resultArr[10].valueOf()),
                    requestState: parseInt(resultArr[11].valueOf()),
                    ischangeRequest: ischangeRequest,
                    changeRequest: changeRequestId
                    // ischangeRequest: (resultArr[12] === 'true')
                };
                // console.log("request data:", ask);


                resolve(ask) ;
            }).catch((error)=> {

                // this.msgService.add({
                //   severity: 'error',
                //   summary: 'תקלת בבלוקציין',
                //   detail: 'Etherium Fatal Error!!!'
                // });
                reject(error);
            });

        });
    };



}


let realService = new RealService();

module.exports = {


    getAllUserGuarantees: (request) => {
        let customerAddress= request.query.customerAddress;
        if (typeof(customerAddress) === "undefined")
            customerAddress=account;
        return realService.getAllGuaranties(customerAddress);

    },

    getGuarantee: (request) => {
        let customerAddress= request.query.customerAddress;
        let guaranteeId= request.query.guaranteeId;
        if (typeof(customerAddress) === "undefined")
            customerAddress=account;
        return realService.getOneGuarantee(guaranteeId,customerAddress);

    },

    getRequestStatus:(request) => {
        let customerAddress= request.query.customerAddress;
        let requestId= request.query.requestId;
        if (typeof(customerAddress) === "undefined") {
            customerAddress=account;
        }
        return realService.getOneRequest(requestId,customerAddress);


    },


getCheck: (request) => {
        return new Promise(resolve => {

            let customerAddress= request.query.customerAddress;
            console.log(customerAddress);
            if (typeof(customerAddress) === "undefined")
                customerAddress=account;
             resolve(
                // aspectType.test);
                "connection check for account :"+customerAddress +  " "+realService.checkService(customerAddress));
        })
    },

    terminateGuarantees: (request) => {

        let guaranteeId = request.body.guaranteeId;
        let requestId = request.body.requestId;
        let comment = request.body.comment;
        let hashcode = request.body.hashcode;
        let customerAddress= request.body.customerAddress;
        // if (typeof(customerAddress) === "undefined")
            customerAddress=account;
        console.log("terminateGuarantees",guaranteeId, requestId, comment, hashcode,customerAddress);
        return realService.terminateGuatanty(guaranteeId, requestId, comment, hashcode,customerAddress);
    },


    updateGuarantees: (request) => {

        let guaranteeId = request.body.guaranteeId;
        let requestId = request.body.requestId;
        let comment = request.body.comment;
        let amount= request.body.amount;
        let date= request.body.date;
        let customerAddress= request.body.customerAddress;
        if (typeof(customerAddress) === "undefined")
            customerAddress=account;
        console.log('request', guaranteeId, requestId, comment, amount, date,customerAddress);
        return realService.guaranteeUpdate(guaranteeId, requestId, comment, amount, date,customerAddress)
    },
}