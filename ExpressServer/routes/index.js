const express = require('express');
const router = express.Router();
const service = require('../service/ether-remote-service');
// const bodyParser = require('body-parser');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

router.get('/api/getAllGuarantees', function(req, res, next) {
    service.getAllGuarantees(req).then(response => {
      res.send(response);
  }).catch(error => {
        // console.log('error is', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getAllCustomerGuaranties', function(req, res, next) {
    service.getAllCustomerGuaranties(req).then(response => {
        res.send(response);
    }).catch(error => {
        // console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getAllBeneficiaryGuarantees', function(req, res, next) {
    service.getAllBeneficiaryGuarantees(req).then(response => {
        res.send(response);
    }).catch(error => {
        // console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getAllBankGuaranties', function(req, res, next) {
    service.getAllBankGuaranties(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});



router.get('/api/getAllRequests', function(req, res, next) {
    service.getRequests(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getAllUserRequests', function(req, res, next) {
    service.getUserRequests(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getAllIssuers', function(req, res, next) {
    service.getAllIssuers(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getGuarantee', function(req, res, next) {
    service.getGuarantee(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getCustomer', function(req, res, next) {
    service.getCustomer(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getBeneficiaryData', function(req, res, next) {
    service.getBeneficiaryData(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getAllBeneficiaries', function(req, res, next) {
    service.getAllBeneficiaries(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/getBankData', function(req, res, next) {
    service.getBankData(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getRequestStatus', function(req, res, next) {
    service.getRequestStatus(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error  3', error);
        res.status(500).send({ error: error.message });

    });
});

router.get('/api/check', function(req, res, next) {
    service.getCheck(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.post('/api/terminateGuarantees', function(req, res, next) {
    service.terminateGuarantees(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.post('/api/updateGuarantees', function(req, res, next) {
    service.updateGuarantees(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.post('/api/guaranteeSignComplite', function(req, res, next) {
    console.log('guaranteeSignComplite begin ');
    service.signComplite(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});



router.get('/api/getGuarantyHistory', function(req, res, next) {
    service.getGuarantyHistory(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.put('/api/createBeneficiary', function(req, res, next) {
    service.createBeneficiary(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.put('/api/createCustomer', function(req, res, next) {
    service.createBeneficiary(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});



router.post('/api/createRequest', function(req, res, next) {
    console.log('createRequest requested');
    service.createRequest(req)
        .then(response => {
            res.send(response);
        })
        .catch(error => {
            console.log('error is ', error);
            res.status(500).send({ error: error.message });

    });
});

router.post('/api/acceptRequest', function(req, res, next) {
    service.acceptRequest(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.post('/api/rejectRequest', function(req, res, next) {
    service.rejectRequest(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.post('/api/updateRequest', function(req, res, next) {
    service.updateRequest(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});

router.post('/api/withdrawalRequest', function(req, res, next) {
    service.withdrawalRequest(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send({ error: error.message });

    });
});


router.get('/api/getRequestHistory', function(req, res, next) {
        service.getRequestHistory(req)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                console.log('error is', error);
                res.status(500).send({error: error.message});
            });
});

    

module.exports = router;


