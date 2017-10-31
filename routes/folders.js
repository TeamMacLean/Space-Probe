const router = require('express').Router();
const Folders = require('../controllers/folders');
router.get('/:location/:folder', Folders.show);

module.exports = router;
