const express = require('express');
const router = express.Router();

// const r = require('../lib/thinky').r;

const Index = require('../controllers/index');
const Reads = require('../controllers/reads');

/* GET home page. */
router.get('/', Index.index);


router.get('/reads/:folderName', Reads.showFolder);

module.exports = router;
