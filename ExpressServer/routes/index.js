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


router.get('/api/getGuarantee', function(req, res, next) {
    service.getGuarantee(req).then(response => {
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

module.exports = router;


