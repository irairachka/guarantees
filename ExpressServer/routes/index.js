const express = require('express');
const router = express.Router();
const service = require('../service/ether-remote-service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getAllGuarantees', function(req, res, next) {
    service.getAllUserGuarantees().then(response => {
      res.send(response);
  })
});

router.post('/terminateGuarantees', function(req, res, next) {
    service.terminateGuarantees(req).then(response => {
        res.send(false);
    });
});

router.post('/updateGuarantees', function(req, res, next) {
    service.updateGuarantees(req).then(response => {
        res.send(response);
    });
});

module.exports = router;
