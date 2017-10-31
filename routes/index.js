const router = require('express').Router();
const Index = require('../controllers/index');
router.get('/', Index.index);

module.exports = router;
