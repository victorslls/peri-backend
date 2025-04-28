const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const Joi = require("joi");

// Schema de validação para criação/atualização de paciente
const patientSchema = Joi.object({
  name: Joi.string().allow(null, "").optional(),
  caseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{22,24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID do caso inválido",
      "any.required": "O ID do caso é obrigatório",
    }),
  numberOfTeeth: Joi.number().min(0).max(32).required().messages({
    "number.base": "O número de dentes deve ser um valor numérico",
    "number.min": "O número de dentes não pode ser negativo",
    "number.max": "O número de dentes não pode ser maior que 32",
    "any.required": "O número de dentes é obrigatório",
  }),
  hasActiveCavities: Joi.boolean().required().messages({
    "boolean.base": "A presença de cáries ativas deve ser sim ou não",
    "any.required": "A informação sobre cáries ativas é obrigatória",
  }),
});

// Schema de validação para o parâmetro ID
const idParamSchema = Joi.object({
  patientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{22,24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID do paciente inválido",
      "any.required": "O ID do paciente é obrigatório",
    }),
});

// Schema de validação para o parâmetro caseId
const caseIdParamSchema = Joi.object({
  caseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{22,24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID do caso inválido",
      "any.required": "O ID do caso é obrigatório",
    }),
});

// Rotas
router.get("/", auth(), patientController.getAllPatients);

router.post(
  "/",
  auth(["perito", "admin", "assistente"]),
  validate(patientSchema),
  patientController.createPatient
);

router.put(
  "/:patientId",
  auth(["perito", "admin"]),
  validate(idParamSchema, "params"),
  validate(patientSchema),
  patientController.updatePatient
);

router.get(
  "/:patientId",
  auth(),
  validate(idParamSchema, "params"),
  patientController.getPatientById
);

router.get(
  "/case/:caseId",
  auth(),
  validate(caseIdParamSchema, "params"),
  patientController.getPatientsByCase
);

router.delete(
  "/:patientId",
  auth(["perito", "admin"]),
  validate(idParamSchema, "params"),
  patientController.deletePatient
);

module.exports = router;
