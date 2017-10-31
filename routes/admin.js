const router = require('express').Router();
const Admin = require('../controllers/admin');
router.get('/admin/delete/scan/:scanID', Admin.deleteScan);

module.exports = router;
