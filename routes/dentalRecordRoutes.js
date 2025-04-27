const express = require('express');
const router = express.Router();
const dentalRecordController = require('../controllers/dentalRecordController');
const auth = require('../middleware/auth');

router.post('/', auth(['perito', 'admin']), dentalRecordController.createDentalRecord);
router.get('/search', auth(), dentalRecordController.searchDentalRecords);

module.exports = router;