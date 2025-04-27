const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Schema de validação para criação de caso
const caseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  type: Joi.string().valid('acidente', 'identificacao', 'criminal').required(),
});

router.post('/', auth(['perito', 'admin', 'assistente']), validate(caseSchema), caseController.createCase);
router.put('/:caseId/status', auth(['perito', 'admin']), caseController.updateCaseStatus);
router.get('/', auth(), caseController.getCases);


module.exports = router;