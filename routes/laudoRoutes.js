const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const auth = require("../middleware/auth");

router.get("/laudo/:casoId", auth(["perito", "admin"]), async (req, res) => {
  try {
    const { casoId } = req.params;
    const evidencias = await Evidence.find({ caso: casoId });
    const caso = await Case.findById(casoId);
    if (!caso) return res.status(404).json({ msg: "Caso não encontrado" });
    if (
      req.user.role !== "admin" &&
      caso.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ msg: "Você não tem permissão para gerar este laudo" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(18).text(`Laudo Pericial: ${caso.nome}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Descrição: ${caso.descricao}`);
    doc.moveDown();
    doc.text("Evidências:");
    evidencias.forEach((evidencia, index) => {
      doc.text(`${index + 1}. ${evidencia.titulo} - ${evidencia.dados}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar laudo.", error });
  }
});

module.exports = router;
