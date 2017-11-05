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

let Regulator = contract(Regulator_artifact);
let GuaranteeRequest = contract(GuaranteeRequest_artifact);
let DigitalGuaranteeBNHP= contract(DigitalGuaranteeBNHP_artifact);
let GuaranteeExtender = contract(GuaranteeExtender_artifact);
let GuaranteeRequestExtender = contract(GuaranteeRequestExtender_artifact);

let accounts;
let account;
let web3;
 
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
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
};

onReady () {
    Regulator.setProvider(this.web3.currentProvider);
    GuaranteeRequest.setProvider(this.web3.currentProvider);
    DigitalGuaranteeBNHP.setProvider(this.web3.currentProvider);
    GuaranteeExtender.setProvider(this.web3.currentProvider);
    GuaranteeRequestExtender.setProvider(this.web3.currentProvider);



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

/************************/
/**  replaced   ****/
/************************/

    getAllGuaranties ()  {
        // if (this.realGuarantees==null) {
        return new Promise((resolve, reject)=> {
            this.getAllUserGuarantees().then((GuarantiesEt)=> {
                // this.realGuarantees = [...mockCustomerGuaranties, ...GuarantiesEt];
                // super.setMockGuarantee(this.realGuarantees);
                resolve([ ...GuarantiesEt]);
            }).catch((error)=> {
                reject(error);
            });
        })
        // }
        // else
        //   new Promise((resolve, reject)=> {
        //     resolve(this.mockGuarantees);
        //   });

    };


    getOneCustomerData  (customerAddress)  {
        return ({
            customerID: customerAddress,
                Name: 'ישראל ישראלי',
                Address: 'יצחק כצנסלון 5, תל אביב'
        });
    };


    getAllUserGuarantees() {
        /** Gets all guarantee requests for customer */
        let customerGuaranties=[];
        return Regulator.deployed()
            .then( (instance)=> {
                return instance.getGuaranteeAddressesList.call({from: this.account});
            }).then( (guaranteeAddresses) =>{
                console.log("guaranteeAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                throw error;
            })
    };

    getOneGuarantee (requestAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return GuaranteeExtender.at(requestAddress)
            .then((guaranteeExtenderInstance)=>  {
                // console.log("getOneGuarantee:get data");
                return guaranteeExtenderInstance.getGuaranteeData.call();
            }).then((result) =>{
                // console.log("getOneGuarantee:", result);
                return this.populateGuaranteeData(result);
            })
            .catch(function(e)  {
                console.log(e);
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


    populateGuaranteeData(resultArr)  {

        const startDatet = this.transformDateSolToJS(resultArr[8].valueOf());
        const endDatet = this.transformDateSolToJS(resultArr[9].valueOf());

        // console.log("dates",resultArr[8].valueOf(),startDatet,resultArr[9].valueOf(),endDatet);
        // const startDate = (new Date(resultArr[8].valueOf() * 1000) ).toDateString();
        // const endDate = (new Date(resultArr[9].valueOf() * 1000) ).toDateString();
        const indexDate=resultArr[11].valueOf();
        const proposal=this.web3.toUtf8( resultArr[6]);
        const full_name=this.web3.toUtf8( resultArr[5]);
        const state= resultArr[12].valueOf();
        var ask= {
            GuaranteeID: resultArr[0],
            GRequestID: resultArr[1],
            customer: resultArr[2],
            beneficiary: resultArr[4],
            bank: resultArr[3],
            customerName: this.getOneCustomerData(resultArr[2]).Name,
            StartDate: startDatet,
            EndDate: endDatet,
            amount: parseInt(resultArr[7].valueOf()),
            fullName:full_name,
            purpose: proposal,
            indexType: parseInt(resultArr[10].valueOf()),
            indexDate: parseInt(indexDate.valueOf()),
            guaranteeState: parseInt(state.valueOf())
        };


        // console.log("populateGuaranteeData:", ask);

        return ask;
    };

    terminateGuatanty  (guaranteeId, requestId, comment , hashcode)  {
        return new Promise((resolve, reject)=> {
            // console.log('rejectRequest',requestId);
            this.terminateGuaranteeEt(guaranteeId).then((result) => {
                console.log(result);
                resolve( true);

            }).catch((error)=> {
                console.error(error);
                reject(error);

            })
        })
    };

    terminateGuaranteeEt  (garantyId)  {

        return Regulator.deployed()
            .then( (instance) =>{
                console.log("terminateGuaranteeEt garantyId",garantyId,"from: account-",account);
                return instance.terminateGuarantee(garantyId ,{from:account});
            }).catch(function (error) {
                throw error;
            })

    };

    guaranteeUpdate  (guatantyId, requestId, comment, amount, date)  {
        return new Promise((resolve, reject)=> {

            resolve(true);
        });
    };





}


let realService = new RealService();

module.exports = {


    getAllUserGuarantees: () => {
        return realService.getAllGuaranties();

    },

    getCheck: () => {
        return new Promise(resolve => {
            resolve(
                // aspectType.test);
                "connection check");
        })
    },

    terminateGuarantees: (request) => {

        let guaranteeId = request.body.guaranteeId;
        let requestId = request.body.requestId;
        let comment = request.body.comment;
        let hashcode = request.body.hashcode;
        console.log("terminateGuarantees",guaranteeId, requestId, comment, hashcode);
        return realService.terminateGuatanty(guaranteeId, requestId, comment, hashcode);
    },


    updateGuarantees: (request) => {
        let guaranteeId = request.body.guaranteeId;
        let requestId = request.body.requestId;
        let comment = request.body.comment;
        let amount= request.body.amount;
        let date= request.body.date;
        console.log('request', guaranteeId, requestId, comment, amount, date);
        return realService.guaranteeUpdate(guaranteeId, requestId, comment, amount, date)
    },
}