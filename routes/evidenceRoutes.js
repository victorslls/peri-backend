const express = require("express");
const router = express.Router();
const evidenceController = require("../controllers/evidenceController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validate } = require("../middleware/validate");

// Schema de validação para evidências
const Joi = require("joi");
const evidenceSchema = Joi.object({
  type: Joi.string()
    .valid(
      "Radiografia Panorâmica",
      "Radiografia Periapical",
      "Fotografia Intraoral"
    )
    .required(),
  content: Joi.string().required(),
  caseId: Joi.string().required(),
});

router.post(
  "/",
  auth(["perito", "admin", "assistente"]),
  upload.array("files", 5), // Permite até 5 arquivos
  validate(evidenceSchema),
  evidenceController.uploadEvidence
);
router.get("/", auth(), evidenceController.listarEvidencias);
router.get("/by-category", auth(), evidenceController.getEvidencesByCategory);

module.exports = router;
