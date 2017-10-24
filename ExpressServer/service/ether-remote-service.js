module.exports = {
    getAllUserGuarantees: () => {
        return new Promise(resolve => {
            resolve([
                {
                    EndDate: "10/05/2019",
                    GRequestID: "0xd532D3531958448e9E179729421B92962fb81Dd1",
                    GuaranteeID: "0xd532D3531958448e9E179729421B92962fb81Dc1",
                    StartDate: "10/05/2017",
                    amount: 10000,
                    bank: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
                    beneficiary: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
                    customer: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
                    customerName: "ישראל ישראלי",
                    fullName: "ישראל ישראלי",
                    guaranteeState: 1,
                    indexDate: 1,
                    indexType: 1,
                    purpose: "מכרז נקיון"
                }
            ]);
        })
    },
    terminateGuarantees: (request) => {
        console.log('request', request);
        return new Promise(resolve => {
            resolve(true);
        })
    },
    updateGuarantees: (request) => {
        console.log('request', request);
        return new Promise(resolve => {
            resolve(true);
        })
    }
};