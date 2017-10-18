const express = require('express');
const router = express.Router();

// const r = require('../lib/thinky').r;

const Index = require('../controllers/index');
const Reads = require('../controllers/reads');
const Homes = require('../controllers/homes');
const Scratch = require('../controllers/scratch');

/* GET home page. */
router.get('/', Index.index);


router.get('/reads/:folderName', Reads.showFolder);

router.get('/scratch/:folderName', Scratch.showFolder);

router.get('/homes/:folderName', Homes.showFolder);

module.exports = router;
