const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const Joi = require("joi");

// Schema de validação para criação de caso
const caseSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  type: Joi.string().valid("acidente", "identificacao", "criminal").required(),
  status: Joi.string()
    .valid("em_andamento", "finalizado", "arquivado")
    .default("em_andamento"),
  data: Joi.date().iso().required(),
  historico: Joi.string().allow("").optional(),
  analises: Joi.string().allow("").optional(),
});

// Validação do parâmetro ID
const idParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{22,24}$/) // Aceita IDs com 22 ou 24 caracteres
    .required()
    .messages({
      "string.pattern.base": "O ID deve ter 22 ou 24 caracteres hexadecimais",
      "any.required": "O ID é obrigatório",
      "string.empty": "O ID não pode estar vazio",
    }),
});

router.post(
  "/",
  auth(["perito", "admin", "assistente"]),
  validate(caseSchema),
  caseController.createCase
);
router.put(
  "/:caseId/status",
  auth(["perito", "admin"]),
  caseController.updateCaseStatus
);
router.get("/", auth(), caseController.getCases);

// Rota para buscar caso por ID
router.get(
  "/:id",
  auth(),
  (req, res, next) => {
    // Log para debug
    console.log("Parâmetros recebidos:", req.params);
    next();
  },
  validate(idParamSchema, "params"),
  caseController.getCaseById
);

module.exports = router;
