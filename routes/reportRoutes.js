const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const reportController = require("../controllers/reportController");
const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const auth = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const Joi = require("joi");

// Schema de validação para criação de laudo
const reportSchema = Joi.object({
  case: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  type: Joi.string()
    .valid("laudo_pericial", "relatorio_tecnico", "parecer_odontologico")
    .required(),
  status: Joi.string()
    .valid("rascunho", "finalizado", "arquivado")
    .default("rascunho"),
});

// Criar novo laudo
router.post(
  "/",
  auth(["perito", "admin"]),
  validate(reportSchema),
  reportController.createReport
);

// Listar laudos
router.get("/", auth(), reportController.getReports);

// Gerar PDF do laudo
router.get(
  "/generate-pdf/:caseId",
  auth(["perito", "admin"]),
  async (req, res) => {
    try {
      const { caseId } = req.params;

      // Buscar caso e evidências
      const [caso, evidencias] = await Promise.all([
        Case.findById(caseId),
        Evidence.find({ caso: caseId }),
      ]);

      // Validações
      if (!caso) {
        return res.status(404).json({ message: "Caso não encontrado" });
      }

      if (
        req.user.role !== "admin" &&
        caso.createdBy.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({ message: "Sem permissão para gerar este laudo" });
      }

      // Gerar PDF
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=laudo-${caseId}.pdf`
      );

      doc.pipe(res);

      // Cabeçalho
      doc.fontSize(18).text("LAUDO PERICIAL ODONTOLÓGICO", { align: "center" });
      doc.moveDown();

      // Informações do Caso
      doc.fontSize(14).text("INFORMAÇÕES DO CASO", { underline: true });
      doc
        .fontSize(12)
        .text(`Título: ${caso.title}`)
        .text(`Tipo: ${caso.type}`)
        .text(`Data: ${new Date(caso.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      // Descrição
      doc.fontSize(14).text("DESCRIÇÃO", { underline: true });
      doc.fontSize(12).text(caso.description);
      doc.moveDown();

      // Evidências
      if (evidencias.length > 0) {
        doc.fontSize(14).text("EVIDÊNCIAS ANALISADAS", { underline: true });
        evidencias.forEach((evidencia, index) => {
          doc
            .fontSize(12)
            .text(`${index + 1}. ${evidencia.type}`)
            .text(`Descrição: ${evidencia.content || "Não fornecida"}`)
            .moveDown(0.5);
        });
      }

      // Finalização do documento
      doc
        .fontSize(12)
        .moveDown(2)
        .text("Local e Data: _____________________________", { align: "right" })
        .moveDown(2)
        .text("Assinatura do Perito: _____________________________", {
          align: "right",
        });

      doc.end();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      res.status(500).json({
        message: "Erro ao gerar laudo em PDF",
        error: error.message,
      });
    }
  }
);

// Download de laudo específico
router.get("/:reportId/download", auth(), reportController.downloadReport);

module.exports = router;
