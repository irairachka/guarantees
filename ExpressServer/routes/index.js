const express = require('express');
const router = express.Router();
const service = require('../service/ether-remote-service');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

router.get('/api/getAllGuarantees', function(req, res, next) {
    service.getAllUserGuarantees().then(response => {
      res.send(response);
  })
});

router.post('/api/terminateGuarantees', function(req, res, next) {
    service.terminateGuarantees(req).then(response => {
        res.send(false);
    });
});

router.post('/api/updateGuarantees', function(req, res, next) {
    service.updateGuarantees(req).then(response => {
        res.send(response);
    });
});

module.exports = router;
