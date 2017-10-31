const router = require('express').Router();
const Locations = require('../controllers/locations');
router.get('/:location', Locations.show);

module.exports = router;
