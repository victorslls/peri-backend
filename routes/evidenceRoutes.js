const express = require('express');
const router = express.Router();
const evidenceController = require('../controllers/evidenceController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth(['perito', 'admin', 'assistente']), upload.single('file'), evidenceController.uploadEvidence);
router.get('/', auth(), evidenceController.getEvidencesByCategory);


module.exports = router;