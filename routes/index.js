const express = require('express');
const router = express.Router();

const r = require('../lib/thinky').r;

// const ReadsFolder = require('../models/readsFolder');
// const ScratchFolder = require('../models/scratchFolder');
// const HomeFolder = require('../models/homeFolder');

const Scan = require('../models/scan');

/* GET home page. */
router.get('/', function (req, res, next) {


    Scan.orderBy({index: r.desc("date")})
        .getJoin()
        .run()
        .then(scans => {
            console.log('scan',scans[0]);
            res.render('index', {scan: scans[0]});

        });
});

module.exports = router;
