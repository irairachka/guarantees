


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


const RequestState = {
        created:0,
        waitingtobank:1,
        handling:2,
        waitingtocustomer:3,
        waitingtobeneficiery:4,
        withdrawed:5,
        accepted:6,
        changeRequested:7,
        rejected:8,
        terminationRequest:9
};
 
class RealService {

    constructor() {
        this.checkAndInstantiateWeb3();
        this.onReady();

    }

    /** ******************** **/
    /**  Setup Functions     **/
    /** ******************** **/

    checkAndInstantiateWeb3() {
        if (typeof this.web3 !== 'undefined') {
            console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        }
    };

    onReady() {
        Regulator.setProvider(this.web3.currentProvider);
        GuaranteeRequest.setProvider(this.web3.currentProvider);
        DigitalGuaranteeBNHP.setProvider(this.web3.currentProvider);
        GuaranteeExtender.setProvider(this.web3.currentProvider);
        GuaranteeRequestExtender.setProvider(this.web3.currentProvider);
        ChangeGuaranteeRequest.setProvider(this.web3.currentProvider);


        this.web3.eth.getAccounts(function (err, accs) {
            if (err != null) {
                console.error("error getting accounts:", err);
                return;
            }

            if (accs.length === 0) {
                console.error("error getting accounts:No accounts found");
                // alert(
                //     'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
                // );
                return;
            }

            accounts = accs;
            account = accounts[0];
            console.log('this.accounts', accounts)
            /** Part of original truffle **/
            // This is run from window:load and ZoneJS is not aware of it we
            // need to use _ngZone.run() so that the UI updates on promise resolution
            // this._ngZone.run(() => {
            //   this.getAllUserRequests();
            // });
        });
    };

    isNullOrUndefined(object) {
        return (object == null || object === undefined);
    }

    checkService(customerAddress = this.account) {
        return "=>Ok for :" + customerAddress;
    }

    /************************/
    /**  replaced   ****/
    /************************/

    getAllGuaranties(customerAddress = this.account) {

        return Regulator.deployed()
            .then((instance)=> {
                console.log('instance.getRequestAddressList.call({from: useraccount} from acc:', instance.address, customerAddress);
                return instance.getGuaranteeAddressesList.call({from: customerAddress});
            }).then((guaranteeAddresses)=> {
                console.log("guaranteeAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                }))
            }).then((guaranteeEt)=> {
                //     console.log("getBeneficiaryEt " ,requestsEt);
                 return guaranteeEt;
            }).catch(function (error) {
                console.error("the error was ewcived:",error);
                throw error;
            });

    };

    getAllCustomerGuaranties(customerAddress=this.account) {

        // return new Promise((resolve, reject)=> {
        //
        //     return this.getAllGuaranties(customerAddress).then((realRequests)=> {
        //         resolve( realRequests
        //             .filter(function (element) {
        //                 return (element.customer === customerAddress);
        //
        //             }));
        //     }).catch(function (error) {
        //         console.error(error);
        //         reject(error);
        //     })
        // })
            //
            // this.getAllUserGuarantees(customerAddress).then((GuarantiesEt)=> {
            //     // this.realGuarantees = [...mockCustomerGuaranties, ...GuarantiesEt];
            //     // super.setMockGuarantee(this.realGuarantees);
            //     resolve([ ...GuarantiesEt]);
            // }).catch((error)=> {
            //     console.error(error);
            //     throw error;
            // });


        return this.getAllGuaranties(customerAddress).then((realRequests)=> {
            return realRequests
                .filter(function (element) {
                    return (element.customer === customerAddress);

                });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })

    };

    getAllBeneficiaryGuarantees(beneficiaryAddress=this.account) {

        return this.getAllGuaranties(beneficiaryAddress).then((realRequests)=> {
            return realRequests
                .filter(function (element) {
                    return (element.beneficiary === beneficiaryAddress);

                });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })

    };

    getAllBankGuaranties(bankAddress=this.account) {

        return this.getAllGuaranties(bankAddress).then((realRequests)=> {
            return realRequests
                .filter(function (element) {
                    return (element.bank === bankAddress);

                });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })

    };


    // getAllGuaranties (customerAddress=this.account)  {
    //     // if (this.realGuarantees==null) {
    //     return new Promise((resolve, reject)=> {
    //         this.getAllUserGuarantees(customerAddress).then((GuarantiesEt)=> {
    //             // this.realGuarantees = [...mockCustomerGuaranties, ...GuarantiesEt];
    //             // super.setMockGuarantee(this.realGuarantees);
    //             resolve([ ...GuarantiesEt]);
    //         }).catch((error)=> {
    //             console.error(error);
    //             reject(error);
    //         });
    //     })
    //
    // };
    //
    //
    // getAllUserGuarantees(customerAddress=this.account) {
    //     /** Gets all guarantee requests for customer */
    //     let customerGuaranties=[];
    //     return Regulator.deployed()
    //         .then( (instance)=> {
    //             return instance.getGuaranteeAddressesList.call({from: customerAddress});
    //         }).then( (guaranteeAddresses) =>{
    //             console.log("guaranteeAddresses[]:", guaranteeAddresses);
    //             return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
    //                 return new Promise(resolve =>
    //                     this.getOneGuarantee(guaranteeAddress).then((returneddata) => resolve(returneddata)));
    //             }));
    //
    //
    //         }).catch(function (error) {
    //             console.error(error);
    //             throw error;
    //         })
    // };




    getAllGuarantees(customerAddress=this.account) {
        /** Gets all guarantee requests for customer */
        let customerGuaranties=[];
        return Regulator.deployed()
            .then( (instance)=> {
                return instance.getGuaranteeAddressesList.call({from: customerAddress});
            }).then( (guaranteeAddresses) =>{
                console.log("guaranteeAddresses[]:", guaranteeAddresses);
                return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                    return new Promise(resolve =>
                        this.getOneGuarantee(guaranteeAddress).then((returneddata) => {return (returneddata) } ));
                }));


            }).catch(function (error) {
                console.error(error);
                throw error;
            })
    };


    getAllUserGuaranties (customerAddress=this.account)  {
        // if (this.realGuarantees==null) {
        return this.getAllGuarantees(customerAddress).then((realGuarantees)=> {
            return realGuarantees
                .filter(function (element) {
                    return (element.customer === customerAddress);

                });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })


    };



    getBeneficiaryEt (beneficiaryAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then( (instance)=> {

                return instance.getBeneficiary.call(beneficiaryAddress);
            }).then((result)=> {
                console.log("getBeneficiaryEt:", result);
                return this.populateBeneficiaryData(beneficiaryAddress,result);
            })
            .catch(function(error)  {
                console.error(error);
            });
    };


    populateBeneficiaryData (benefisiaryID,resultArr)  {

        if (Array.isArray(benefisiaryID)) benefisiaryID=benefisiaryID[0];
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

            let customerItem = realCustomers.find((item) => {
                return item.customerID === customerAddress;
            });

            if (customerItem !== undefined )
            {
                resolve ( customerItem );
            }

            // console.log('not found Customer',customerAddress ,realCustomers);

            this.getOneCustomerEt(customerAddress).then((loadedCustomer)=> {
                console.log('loadedCustomer',customerAddress,loadedCustomer );
                if (!realCustomers.includes(loadedCustomer))
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

    getAllRequests  (customerAddress=this.account) {

        // /** Gets all guarantee requests for customer */
        // return new Promise((resolve, reject)=> {
        //     console.log("getAllUserRequestsEt in getAllRequests()",this.account);
            // debugger;
            return Regulator.deployed()
                .then( (instance)=> {
                    console.log('instance.getRequestAddressList.call({from: useraccount} from acc:',instance.address,customerAddress);
                    return instance.getRequestAddressList.call({from: customerAddress});
                }).then( (guaranteeAddresses)=> {
                    console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
                    return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
                        return new Promise(resolve =>
                            this.getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
                    }))
                }).then((requestsEt)=> {
                        //     console.log("getBeneficiaryEt " ,requestsEt);
                        return requestsEt;
                }).catch(function (error) {
                    console.error(error);
                    throw error;
                });

        };



    getAllUserRequests(customerAddress=this.account)
    {

        // return new Promise((resolve, reject)=> {

        return this.getAllRequests(customerAddress).then((realRequests)=> {
            return realRequests
                .filter(function (element) {
                return (element.customer === customerAddress);

            });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })

    };

    getAllBankRequests( bankAddress=this.account)
    {

        // return new Promise((resolve, reject)=> {

        return this.getAllRequests(bankAddress).then((realRequests)=> {
            return realRequests
                .filter(function (element) {
                    return (element.bank === bankAddress);

                });
        }).catch(function (error) {
            console.error(error);
            throw error;
        })

    };



    // getAllRequests  (customerAddress=this.account) {
    //
    //     /** Gets all guarantee requests for customer */
    //     return new Promise((resolve, reject)=> {
    //         console.log("getAllUserRequestsEt in getAllRequests()",this.account);
    //         // debugger;
    //         this.getAllUserRequestsEt(customerAddress).then((requestsEt)=> {
    //             console.log("getBeneficiaryEt " ,requestsEt);
    //             let realRequests=[ ...requestsEt];
    //             resolve(realRequests);
    //         }).catch(function (error) {
    //             console.error(error);
    //             throw error;
    //         })
    //
    //     });
    //
    // };
    //
    // getAllUserRequestsEt(useraccount) {
    //     /** Gets all guarantee requests for customer */
    //     // let customerGuarantie=[];
    //     return Regulator.deployed()
    //         .then( (instance)=> {
    //             console.log('instance.getRequestAddressList.call({from: useraccount} from acc:',instance.address,useraccount);
    //             return instance.getRequestAddressList.call({from: useraccount});
    //         }).then( (guaranteeAddresses)=> {
    //             console.log("guaranteeRequestAddresses[]:", guaranteeAddresses);
    //             return Promise.all(guaranteeAddresses.map((guaranteeAddress) => {
    //                 return new Promise(resolve =>
    //                     this.getOneRequest(guaranteeAddress).then((returneddata) => resolve(returneddata)));
    //             }));
    //
    //         }).catch(function (error) {
    //             console.error(error);
    //             throw error;
    //         })
    // };



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


    getGuarantyHistory (requestId,customerAddress=this.account)  {
        return new Promise((resolve, reject)=> {

            // console.log('getGuarantyHistory',requestId,customerAddress);
            this.getGuarantyHistoryEt(requestId).then((history)=>
            {
                console.log(history);
                resolve(history);
            }).catch((error)=> {
                console.error('error',error);
                // this.msgService.add({
                //     severity: 'error',
                //     summary: 'ערבות חדשה',
                //     detail: 'בקשה לקבלת פירוט נכשלה'
                // });
                reject(error);


            })

        });
    };

    getGuarantyHistoryEt  (guaranteeAddress)  {

        return new Promise((resolve,reject) => {


            var requestevents = [];
            var guarantee = DigitalGuaranteeBNHP.at(guaranteeAddress);
            var allevents = guarantee.allEvents({fromBlock: 0, toBlock: 'latest'})

            return allevents.get( (error, result)=> {

                if (error)
                    reject(error);
                // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
                for (var i = result.length - 1; i >= 0; i--) {
                    var cur_result = result[i];
                    let line=this.populateHistoryLineData(cur_result.event, cur_result.args);
                    if (!this.isNullOrUndefined(line))
                        requestevents.push(line);
                }

                var replay=
                {
                    shortguarantee: guaranteeAddress,
                    log: requestevents
                };

                resolve(replay);

            });
        })
    };

    populateHistoryLineData (event, args)  {
        console.log("populateHistoryLineData",event, args);
        if (!this.isNullOrUndefined(event) && !this.isNullOrUndefined(args))
        {

            const pDate = (new Date(args.timestamp.valueOf() * 1000) ).toDateString();
            const state =args.curentstatus.valueOf();
            var comment_ = args.commentline;
            if (typeof(comment_) == "undefined") {
                comment_ =""
            }

            var ask= {
                eventname:event,
                date: pDate,
                state: state,
                comment: comment_


            };

            return ask;

        }

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
                return ChangeGuaranteeRequest.new(guaranteeId, amount, EndDate,{gas:5700000,from: userAccount});
            })
            .then( (ChangeGuaranteeRequestinstance) => {
                // console.log("change  guaranteeId ChangeGuaranteeRequestinstance", ChangeGuaranteeRequestinstance.address,ChangeGuaranteeRequestinstance)
                ChangeGuaranteeRequestinstanceAddress=ChangeGuaranteeRequestinstance.address;
                return Regulator_instance.changeGuarantee(ChangeGuaranteeRequestinstanceAddress,guaranteeId,{from: userAccount});
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
        // console.log('test');
        return GuaranteeRequest.at(requestAddress)
            .then((guaranteeRequestinstance)=>  {
                // console.log("getOneRequest:get data");
                // console.log('test1');
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
            const changeRequestId=((resultArr[12] == true && resultArr[13] !== undefined )? resultArr[13] : '') ;

            this.getOneBeneficiaryDataP(resultArr[3]).then((beneficiary)=> {

                var ask = {
                    GRequestID: resultArr[0],
                    customer: resultArr[1],
                    bank: resultArr[2],
                    beneficiary: resultArr[3],
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


    guaranteeSignComplite  (requestId, comment , hashcode ,customerAddress=account) {
        return new Promise((resolve, reject)=> {

            console.log("before guaranteeSignComplite res",requestId, comment , hashcode);
            this.guaranteeSignCompliteEt(requestId, hashcode,customerAddress).then((result2) => {
                    console.log("after guaranteeSignComplite result2",result2);

                    if (result2 =='0x0000000000000000000000000000000000000000')
                    {
                        reject('בקשה להוצאת האישור ערבות  נכשלה');
                    }
                    else {
                        resolve(result2);
                    }

                }).catch((error)=> {
                    reject(error);
                });
            });
    };

    guaranteeAddressFromRequestEt  (requestId,customerAddress) {

        var guaranteeRequest = GuaranteeRequest.at(requestId);
        return guaranteeRequest.getGuaranteeAddress.call({from:customerAddress});


    };


    guaranteeSignCompliteEt  (requestId,guaranteeIPFSHash,customerAddress)  {
        // אישור של
        // if  (hashcode) {
        var guaranteeIPFSHashEt='0x'.concat(guaranteeIPFSHash);
        const hashcodeBug="0xe04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f00001";


        return Regulator.deployed()
            .then( (instance)=> {
                console.log("guaranteeSignCompliteEt + this.account", requestId, guaranteeIPFSHash, customerAddress);
                // requestId='0x7e228709e104d5570000032bc61de79bac564724d0a89';
                // console.log("new in testguaranteeSignCompliteEt + this.account", requestId, guaranteeIPFSHash, account);
                return instance.GuaranteeSignComplite(requestId, hashcodeBug, {gas: 5700000 ,from: customerAddress});
            }).then( (tx)=> {
                console.log("testguaranteeSignCompliteEt  resault", tx);
                return this.guaranteeAddressFromRequestEt(requestId,customerAddress);
            }).catch(function (error) {
                console.error('error',error);
                throw error;
            })

    };


    /************************/
    /**  Get User Data   ****/
    /************************/

    getCustomerData (customerAddress=this.account) {

        return new Promise((resolve, reject)=> {


            this.getOneCustomerEt(customerAddress).then((loadCustomer)=> {
                // this.realCustomers.add(loadCustomer)
                // console.log(this);
                resolve( loadCustomer);
            })
                .catch(function (error) {
                    console.error(error);
                    reject(error);
                });
        })
    };







    /** ****************** **/
    /**  Get Bank Data     **/
    /** ****************** **/

    getBankData  (customerAddress=this.account)  {
        // debugger;
        return new Promise((resolve, reject)=> {

            console.log('customerAddress and this.account is undefined', customerAddress, this.account);

            this.getIssierEt(customerAddress).then((loadCustomer)=> {
                // console.log(this);
                resolve( loadCustomer);
            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });

        });
    };


    getAllIssuers  ()  {

        /** Gets all guarantee requests for customer */
        return new Promise((resolve, reject)=> {
            console.log("getAllIssuers in getAllRequests()",this.account);
            // debugger;
            this.getAllIssuersEt().then((issuersEt)=> {
                console.log("getBeneficiaryEt " ,issuersEt);
                let realissuers=[ ...issuersEt];
                resolve(realissuers);
            }).catch(function (error) {
                console.error(error);
                throw error;
            })

        });


    }


    getAllIssuersEt(){
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        let  issuers=[];
        return Regulator.deployed()
            .then( (instance)=> {
                return instance.getIssuerAddressesList.call({from: this.account});
            }).then( (issuersAddresses)=> {
                console.log("issuersAddresses[]:", issuersAddresses);
                return Promise.all(issuersAddresses.map((issuersAddress) => {
                    return new Promise(resolve =>
                        this.getBankData(issuersAddresses).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                reject(error);
            })
    };



    getIssierEt (issierAddress)  {
        /** Gets one guarantee requests by id */
        /** parses the data and sends to UI */
        return Regulator.deployed()
            .then( (instance)=> {

                return instance.getIssuer.call(issierAddress, {from: this.account});
            }).then((result)=> {
                console.log("issier:", result);
                return this.populateIssuerData(issierAddress,result);
            })
            .catch((e)  =>{
                console.log(e);
            });
    };

    populateIssuerData(issierID,resultArr) {


        var ask= {
            bankID: issierID,
            Name: resultArr[0],
            Address: resultArr[1]
        };

        // console.log("request data:", ask);

        return ask;
    };


    /** ************************* **/
    /**  Get Beneficiary Data     **/
    /** ************************* **/

    getAllBeneficiaries  ()  {
        return this.getAllBeneficiariesEt();
    };

    getAllBeneficiariesEt() {
        // function getAllUserRequests() {
        /** Gets all guarantee requests for customer */
        // let customerGuaranties=[];
        return Regulator.deployed()
            .then( (instance)=> {
                return instance.getBeneficiaryAddresses.call({from: this.account});
            }).then( (beneficiaryAddresses)=> {
                console.log("beneficiaryAddresses[]:", beneficiaryAddresses);
                return Promise.all(beneficiaryAddresses.map((beneficiaryAddress) => {
                    return new Promise(resolve =>
                        this.getOneBeneficiaryDataP(beneficiaryAddress).then((returneddata) => resolve(returneddata)));
                }));


            }).catch(function (error) {
                throw error;
            })
    };

    // getAllBeneficiaryGuaranties  ()  {
    //     return this.getAllGuaranties();
    // };


    getBeneficiaryData  (BeneficiaryAddress=this.account) {
        return this.getOneBeneficiaryDataP(BeneficiaryAddress);

    };


    getOneBeneficiaryDataP  (beneficiaryID )  {
        return new Promise((resolve, reject)=> {

            let beneficiaryItem = realBeneficiaries.find((item) => {
                return item.beneficiaryID === beneficiaryID;
            });

            if (beneficiaryItem !== undefined )
            {
                resolve( beneficiaryItem);
            }
            
            
            this.getBeneficiaryEt(beneficiaryID).then((loadBeneficiaries)=> {
                console.log("getOneBeneficiaryDataP 3" ,loadBeneficiaries);
                // this.realBeneficiaries = [...this.realBeneficiaries, loadBeneficiaries];
                resolve(loadBeneficiaries);
            }).catch((error)=> {

                reject(error);
            });

        });
    };


    createBeneficiaryEt ( beneficiaryAccount , fullname, fullAddress)
    {


        return Regulator.deployed().then(function(instance) {
            console.log('createBeneficiaryEt',beneficiaryAccount , fullname, fullAddress ,this.account) ;
            return instance.submitBeneficiary(beneficiaryAccount, fullAddress, fullname ,{from: this.account});
        }).catch(function(error) {
            console.error('error',error);
            throw error;
        });


    };


    createCustomerEt ( customerAccount , fullname, fullAddress)
    {
        return Regulator.deployed().then(function(instance) {
            console.log('createBeneficiaryEt',customerAccount , fullname, fullAddress ,this.account ) ;
            return instance.submitCustomer(customerAccount,fullAddress,fullname ,{from: this.account});
        }).catch(function(error) {
            console.error('error',error);
            throw error;
        });

    };



    // getBeneficiaryEt (beneficiaryAddress)  {
    //     /** Gets one guarantee requests by id */
    //     /** parses the data and sends to UI */
    //     return Regulator.deployed()
    //         .then( (instance)=> {
    //             console.log("getBeneficiaryEt " ,beneficiaryAddress);
    //             return instance.getBeneficiary.call(beneficiaryAddress);
    //         }).then((result)=> {
    //             console.log("getBeneficiary:", result);
    //             return this.populateBeneficiaryData(beneficiaryAddress,result);
    //         })
    //         .catch(function(e)  {
    //             console.log(e);
    //         });
    // };


    // populateBeneficiaryData (benefisiaryID,resultArr)  {
    //
    //     if (Array.isArray(benefisiaryID)) benefisiaryID=benefisiaryID[0];
    //     var ask= {
    //         beneficiaryID: benefisiaryID,
    //         Name: resultArr[0] ,
    //         Address: resultArr[1]
    //     };
    //     // console.log("request data:", ask);
    //
    //     return ask;
    // };


    /** ************************* **/
    /**  request operations       **/
    /** ************************* **/

    createRequest( userId , bankId, benefId , purpose, fullName='full name',
                   amount, StartDate, EndDate, indexType, indexDate ,hashcode='e04dd1aa138b7ba680bc410524ce034bd53c190f0dcb4926d0cd63ab57f0fdc2') {


        return new Promise((resolve, reject)=> {


            // let  requestAddr;
            // let instance ;
            let addressOfIns;
            const thestartDate =  this.transformDateJSToSol(StartDate);
            const theendDate = this.transformDateJSToSol(EndDate) ;
            console.log("createRequest ",userId, bankId, benefId, fullName, purpose,
                amount, thestartDate, theendDate, indexType, indexDate);

            // debugger;
            return this.createRequestEt(userId, bankId, benefId, fullName, purpose,
                amount, thestartDate, theendDate, indexType, indexDate, hashcode)
                .then((theinstance) => {
                    // instance=theinstance;
                    addressOfIns=theinstance.address;
                    console.log("Request created with address",addressOfIns);
                    
                    return this.addRequestEt(account, addressOfIns);
                }).then((result) => {
                     // requestAddr=result;
                     // console.log("requestAddr = result", requestAddr);

                    return this.submitRequestEt(account, this.getGuaranteeRequestInstance(addressOfIns), '');
                }).then((result) => {

                    console.log("submitRequestEt result", result, addressOfIns, " <> ",
                        userId," <> ",
                        bankId," <> ",
                        benefId);

                    resolve( addressOfIns);

                }).catch(function(error)  {
                    console.error(error);
                    reject(error);
                });

        });

    };

    withdrawalRequest  (requestId, comment)  {
        return new Promise((resolve, reject)=> {
            this.withdrawalRequestEt(this.getGuaranteeRequestInstance(requestId), '', account).then((result) => {
                resolve(result);
            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });



        });
    };



    updateRequest  (requestId, comment)  {
        return new Promise((resolve, reject)=> {

            this.updateRequestEt(this.getGuaranteeRequestInstance(requestId), comment, RequestState.handling).then((result) => {
                resolve(result);

            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });

        });
    };




    rejectRequest  (requestId, comment)  {
        return new Promise((resolve, reject)=> {
            // console.log('rejectRequest',requestId);
            if(comment == null) comment="NaN";
            this.rejectRequestEt(this.getGuaranteeRequestInstance(requestId), comment).then((result) => {

                resolve(result);

            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });



        });
    };





    acceptRequest  (requestId, comment , hashcode)  {
        return new Promise((resolve, reject)=> {
            console.log('acceptRequest',requestId);
            this.acceptRequestEt(requestId).then((result) => {

            resolve(true);
            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });
        })
    };



    createRequestEt ( userAccount , bankAccount, benefAccount ,fullname, purpose,
                       amount, StartDate, EndDate, indexType, indexDate,proposalIPFSHash) 
    {
        // var StartDateEt=Math.floor((StartDate/1000));
        // var EndDateEt=Math.floor((EndDate/1000));
        if (purpose === 'undefined' || purpose==null)
            purpose='';
        var purposeEt=this.web3.fromUtf8(purpose);
        var fullnameEt=this.web3.fromUtf8(fullname);
        var proposalIPFSHashEt='0x'.concat(proposalIPFSHash);
        console.log( "createRequestEt",bankAccount,benefAccount);
        return (GuaranteeRequest.new(bankAccount,benefAccount,fullnameEt,purposeEt,amount,StartDate,EndDate,indexType, indexDate,proposalIPFSHashEt,{gas:5700000,from: userAccount}));
    };

    submitRequestEt ( userAccount ,guaranteeRequestInstance ,comments)  {
        console.log("submitRequest:",userAccount,guaranteeRequestInstance.address);
        return guaranteeRequestInstance.submit(comments,{from: userAccount});
    };

    withdrawalRequestEt  (guaranteeRequestInstance, comments,userAccount)  {
        // let requestInstance = getGuaranteeRequestInstance(requestId);
         console.log("withdrawal:", userAccount, guaranteeRequestInstance.address ,comments);
        return guaranteeRequestInstance.withdrawal(comments, {from: userAccount});
    };


    getGuaranteeRequestInstance (requestAddress) 
    {
        console.log(this.getGuaranteeRequestInstance ,requestAddress);
        return GuaranteeRequest.at(requestAddress);
    };



    addRequestEt( userAccount , reqaddress) 
    {
        return Regulator.deployed().then(function(instance) {
            return instance.addGuaranteeRequest(reqaddress,{from: userAccount});
        }).catch(function(error) {
            console.error(error);
            throw error;
        });
    };

    getRequestStateEt ( userAccount , guaranteeRequestInstance) {
        return guaranteeRequestInstance.getRequestState.call({from: userAccount});
    };




    updateRequestEt  (guaranteeRequestInstance, comment ,state)  {
        // עדכון של בנק
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        return guaranteeRequestInstance.bankStateChange(comment,state,{from: account});
    };

    rejectRequestEt  (guaranteeRequestInstance, comment)  {
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        return guaranteeRequestInstance.reject(comment,{from: account});
    };

    acceptRequestEt  (requestId) {
        // אישור של בנק
        // if  (hashcode) {
        // let guaranteeRequestInstance=getGuaranteeRequestInstance(requestId);
        // return guaranteeRequestInstance.accept(comment)
        return Regulator.deployed()
            .then( (instance)=> {
                // console.log("acceptRequestEt requestId",requestId)
                return instance.acceptGuaranteeRequest(requestId,{from: account});

            }).catch(function (error) {
                throw error;
            })

    };

    getRequestHistory (requestAddress ) {

        return new Promise((resolve, reject)=> {
            this.getRequestHistoryEt(requestAddress ).then((history)=> {
                console.log(history);
                resolve(history);

            }).catch(function(error)  {
                console.error(error);
                reject(error);
            });

        });
    };



    getRequestHistoryEt  (requestAddress )  {

        return new Promise((resolve) => {


            var requestevents = [];
            var guaranteeRequest = GuaranteeRequest.at(requestAddress);
            var allevents = guaranteeRequest.allEvents({fromBlock: 0, toBlock: 'latest'})

            if (allevents.length>0)
                return allevents.get( (error, result) => {

                    // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
                    for (var i = result.length - 1; i >= 0; i--) {
                        var cur_result = result[i];
                        // console.log('getRequestHistoryEt',cur_result);
                        let line = this.populateHistoryLineData(cur_result.event, cur_result.args);
                        if (!this.isNullOrUndefined(line))
                            requestevents.push(line);
                    }


                    var replay =
                    {
                        shortrequest: requestAddress,
                        log: requestevents
                    };

                    resolve(replay);

                })
            else {
                guaranteeRequest = ChangeGuaranteeRequest.at(requestAddress);
                allevents = guaranteeRequest.allEvents({fromBlock: 0, toBlock: 'latest'});

                return allevents.get((error, result) => {

                    // RegulatoryContractDeployed({}, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
                    for (var i = result.length - 1; i >= 0; i--) {
                        var cur_result = result[i];
                        // console.log('getRequestHistoryEt',cur_result);
                        let line = this.populateHistoryLineData(cur_result.event, cur_result.args);
                        if (!this.isNullOrUndefined(line))
                            requestevents.push(line);
                    }
                    var replay =
                    {
                        shortrequest: requestAddress,
                        log: requestevents
                    };

                    resolve(replay);
                });
            }


        })
    };
    


}







let realService = new RealService();

module.exports = {


    getAllCustomerGuaranties: (request) => {
        return new Promise((resolve, reject)=> {
            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve( realService.getAllCustomerGuaranties(customerAddress));
        });
    },

    getAllGuarantees: (request) => {

        return new Promise((resolve, reject)=> {
            let customerAddress = request.query.customerAddress;
            console.log("getAllGuarantees",customerAddress, request.query,customerAddress,request.body , request.search);
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve( realService.getAllGuaranties(customerAddress));
        });
    },

    getAllBeneficiaryGuarantees: (request) => {
        return new Promise((resolve, reject)=> {
            let beneficiaryAddress = request.query.beneficiaryAddress;
            if (typeof(beneficiaryAddress) === "undefined")
                beneficiaryAddress = account;
            resolve(realService.getAllBeneficiaryGuarantees(beneficiaryAddress));
        });
    },


    getAllBankGuaranties: (request) => {
        return new Promise((resolve, reject)=> {
            let bankAddress = request.query.bankAddress;
            if (typeof(bankAddress) === "undefined")
                bankAddress = account;
            resolve( realService.getAllBankGuaranties(bankAddress));
        });
    },


    getRequests: (request) => {
        return new Promise((resolve, reject)=> {
            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve(realService.getAllRequests(customerAddress));
        });
    },

    getUserRequests: (request) => {
        return new Promise((resolve, reject)=> {
            // throw new Error ("error test");
            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve(realService.getAllUserRequests(customerAddress));
        });
    },

    getBankRequests: (request) => {
        return new Promise((resolve, reject)=> {

            let bankAddress = request.query.bankAddress;
            if (typeof(bankAddress) === "undefined")
                bankAddress = account;
            resolve( realService.getBankRequests(bankAddress));
        });
    },

    getGuarantee: (request) => {
        return new Promise((resolve, reject)=> {
            let customerAddress = request.query.customerAddress;
            let guaranteeId = request.query.guaranteeId;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve(realService.getOneGuarantee(guaranteeId, customerAddress));
        });

    },

    getRequestStatus: (request) => {
        return new Promise((resolve, reject)=> {

            let customerAddress = request.query.customerAddress;
            let requestId = request.query.requestId;
            if (typeof(customerAddress) === "undefined") {
                customerAddress = account;
            }
            resolve(realService.getOneRequest(requestId, customerAddress));

        });
    },

    getAllIssuers: (request) => {
        return realService.getAllIssuers();
    },


    getCustomer: (request) => {
        return new Promise((resolve, reject)=> {

            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve(realService.getCustomerData(customerAddress));
        });
    },

    getAllBeneficiaries: (request) => {
        return realService.getAllBeneficiaries();
    },


    getBankData: (request) => {
        return new Promise((resolve, reject)=> {

            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve( realService.getBankData(customerAddress));
        });
    },

    getBeneficiaryData: (request) => {
        return new Promise((resolve, reject)=> {

            let BeneficiaryAddress = request.query.beneficiaryAddress;
            if (typeof(BeneficiaryAddress) === "undefined")
                BeneficiaryAddress = account;
                resolve( realService.getBeneficiaryData(BeneficiaryAddress));
        });
    },


    getCheck: (request) => {
        return new Promise(resolve => {

            let customerAddress = request.query.customerAddress;
            console.log(customerAddress);
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            resolve(
                // aspectType.test);
                "connection check for account :" + customerAddress + " " + realService.checkService(customerAddress));
        })
    },

    terminateGuarantees: (request) => {
        return new Promise((resolve, reject)=> {

            let guaranteeId = request.body.guaranteeId;
            let requestId = request.body.requestId;
            let comment = request.body.comment;
            let hashcode = request.body.hashcode;
            let customerAddress = request.body.customerAddress;

            if (typeof(customerAddress) === "undefined")
                customerAddress = account;

            console.log('getRequestHistory', requestId);
            if (typeof(guaranteeId ) === "undefined" ||
                typeof(requestId ) === "undefined"
            ) {
                console.log('errror created', requestId);
                throw ( new Error("arguments can't be undefined"));
            }

            console.log("terminateGuarantees", guaranteeId, requestId, comment, hashcode, customerAddress);
            resolve(realService.terminateGuatanty(guaranteeId, requestId, comment, hashcode, customerAddress));
        });
    },


    updateGuarantees: (request) => {

        return new Promise((resolve, reject)=> {
            let guaranteeId = request.body.guaranteeId;
            let requestId = request.body.requestId;
            let comment = request.body.comment;
            let amount = request.body.amount;
            let date = request.body.date;
            let customerAddress = request.body.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;


            if (typeof(guaranteeId ) === "undefined" ||
                typeof(requestId ) === "undefined" ||
                typeof(date ) === "undefined" ||
                typeof(amount ) === "undefined"
            ) {
                console.log('errror created', requestId);
                throw ( new Error("arguments can't be undefined"));
            }


            console.log('request', guaranteeId, requestId, comment, amount, date, customerAddress);
            resolve(realService.guaranteeUpdate(guaranteeId, requestId, comment, amount, date, customerAddress));
        });
    },

    signComplite: (request) => {
        return new Promise((resolve, reject)=> {
            let requestId = request.body.requestId;
            let comment = request.body.comment;
            if (typeof(comment) === "undefined")
                comment = "";
            let hashcode = request.body.hashcode;
            let customerAddress = request.body.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;

            if (typeof(requestId ) === "undefined" ||
                typeof(hashcode ) === "undefined"
            ) {
                console.log('errror created', requestId);
                throw ( new Error("arguments can't be undefined"));
            }


            console.log('request', requestId, comment, hashcode, customerAddress);
            resolve(realService.guaranteeSignComplite(requestId, comment, hashcode, customerAddress));
        });
    },


    

    createBeneficiary: (request) => {
        return new Promise((resolve, reject)=> {


            let beneficiaryAccount = request.body.beneficiaryAccount;
            let fullname = request.body.fullname;
            let fullAddress = request.body.fullAddress;

            if (typeof(beneficiaryAccount) === "undefined" ||
                typeof(fullname) === "undefined" ||
                typeof(fullAddress) === "undefined"
            ) {
                throw Error("arguments can't be undefined");
            }


            console.log('createBeneficiar', beneficiaryAccount, fullname, fullAddress);
            resolve( realService.createBeneficiaryEt(beneficiaryAccount, fullname, fullAddress));
        });
    },

    createCustomer: (request) => {

        return new Promise((resolve, reject)=> {


            let customerAccount = request.body.customerAccount;
            let fullname = request.body.fullname;
            let fullAddress = request.body.fullAddress;

            if (typeof(customerAccount) === "undefined" ||
                typeof(fullname) === "undefined" ||
                typeof(fullAddress) === "undefined"
            ) {
                throw Error("arguments can't be undefined");
            }


            console.log('createCustomer', customerAccount, fullname, fullAddress);
            resolve(realService.createCustomerEt(customerAccount, fullname, fullAddress));
        });
    },


    createRequest: (request) => {


        return new Promise((resolve, reject)=> {


            let userAccount = request.body.userAccount;
            let bankAccount = request.body.bankAccount;
            let beneficiaryAccount = request.body.beneficiaryAccount;
            let purpose = request.body.purpose;
            let fullName = request.body.fullName;
            let amount = request.body.amount;
            let StartDate = request.body.StartDate;
            let EndDate = request.body.EndDate;
            let indexType = request.body.indexType;
            let indexDate = request.body.indexDate;
            let hashcode = request.body.hashcode;

            console.log('createRequest',   userAccount ,bankAccount , beneficiaryAccount , purpose , fullName ,
                amount , StartDate , EndDate ,indexType , indexDate , hashcode );

            if (typeof(userAccount) === "undefined" ||
                typeof(bankAccount) === "undefined" ||
                typeof(beneficiaryAccount) === "undefined" ||
                typeof(purpose) === "undefined" ||
                typeof(fullName) === "undefined" ||
                typeof(amount) === "undefined" ||
                typeof(StartDate) === "undefined" ||
                typeof(EndDate) === "undefined" ||
                typeof(indexType) === "undefined" ||
                typeof(indexDate) === "undefined" ||
                typeof(hashcode) === "undefined"
            )
            {
                throw Error("arguments can't be undefined");
            }



        console.log('createRequest', userAccount, bankAccount, beneficiaryAccount, purpose, fullName,
            amount, StartDate, EndDate, indexType, indexDate, hashcode);

        resolve( realService.createRequest(userAccount, bankAccount, beneficiaryAccount, purpose, fullName,
            amount, StartDate, EndDate, indexType, indexDate, hashcode));
    });

    },


    acceptRequest: (request) => {

        return new Promise((resolve, reject)=> {


            let requestId = request.body.requestId;
            let comment = request.body.comment;
            let hashcode = request.body.hashcode;

            if (typeof(requestId) === "undefined" ||
                typeof(hashcode) === "undefined"
            ) {
                throw Error("arguments can't be undefined");
            }

            console.log('acceptRequest', requestId, comment, hashcode);

            resolve(realService.acceptRequest(requestId, comment, hashcode));
        });
    },


    rejectRequest: (request) => {
        return new Promise((resolve, reject)=> {


            let requestId = request.body.requestId;
            let comment = request.body.comment;

            if (typeof(requestId) === "undefined"
            ) {
                throw Error("arguments can't be undefined");
            }


            console.log('rejectRequest', requestId, comment);

            resolve(realService.rejectRequest(requestId, comment));
        });
    },

    updateRequest: (request) => {
        return new Promise((resolve, reject)=> {

        let requestId = request.body.requestId;
        let comment = request.body.comment;

        if (typeof(requestId) === "undefined"
        ) {
            throw Error("arguments can't be undefined");
        }


        console.log('updateRequest', requestId, comment);
            realService.updateRequest(requestId, comment).then((resault) =>{
                resolve (requestId);
            }).catch((error)=>
            {
                reject(error);
            })

    });
    },

    withdrawalRequest: (request) => {

        return new Promise((resolve, reject)=> {
            let requestId = request.body.requestId;
            let comment = request.body.comment;

            console.log('withdrawalRequest', requestId);
            if (typeof(requestId ) === "undefined"
            ) {
                console.log('errror created', requestId);
                throw ( new Error("argument requestId can't be undefined"));
            }
            if (typeof(comment ) === "undefined"
            ) {
                comment='';
            }

            console.log('withdrawalRequest', requestId, comment);
            resolve( realService.withdrawalRequest(requestId, comment));
        });

    },




    getGuarantyHistory: (request) => {

        return new Promise((resolve, reject)=> {
            let guaranteeId = request.query.guaranteeId;
            let customerAddress = request.query.customerAddress;
            if (typeof(customerAddress) === "undefined")
                customerAddress = account;
            console.log('getRequestHistory', guaranteeId);
            if (typeof(guaranteeId ) === "undefined"
            ) {
                console.log('errror created', guaranteeId);
                throw ( new Error("arguments can't be undefined"));
            }


            resolve
            (realService.getGuarantyHistory(guaranteeId, customerAddress));
        });
    },

    
    getRequestHistory: (request) => {
        return new Promise((resolve, reject)=> {
            let requestId = request.query.requestId;
            console.log('getRequestHistory',requestId , request.query , request.params, request._body , request.search);
            if (typeof(requestId ) === "undefined"
            )
            {
                console.log('errror created',requestId);
                throw ( new Error( "arguments can't be undefined"));
            }

                console.log('getRequestHistory', request.query,request.params ,request.body,requestId);
                resolve ( realService.getRequestHistory(requestId));


        });


    }


};