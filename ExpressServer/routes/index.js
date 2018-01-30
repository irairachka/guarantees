const express = require('express');
const router = express.Router();
const service = require('../service/ether-remote-service');



/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

router.get('/api/getAllGuarantees', function(req, res, next) {
    service.getAllUserGuarantees(req).then(response => {
      res.send(response);
  }).catch(error => {
        console.log('error', error);
        res.status(500).send(error);

    });
});

router.get('/api/getAllRequests', function(req, res, next) {
    service.getRequests(req).then(response => {
        res.send(response);
    }).catch(error => {
        console.log('error', error);
        res.status(500).send(error);

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

module.exports = router;


