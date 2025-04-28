const Evidence = require("../models/Evidence");
const Case = require("../models/Case");
const ActivityLog = require("../models/ActivityLog");
const logger = require("../utils/logger");

exports.listarEvidencias = async (req, res) => {
  try {
    const { caseId } = req.query;
    const filtro = caseId ? { caseId } : {};

    const evidencias = await Evidence.find(filtro)
      .populate("uploadedBy", "name email")
      .populate("caseId", "title type");

    res.status(200).json({
      message: "Evidências recuperadas com sucesso",
      data: evidencias,
    });
  } catch (error) {
    logger.error("Erro ao listar evidências:", error);
    res.status(500).json({ message: "Erro ao buscar evidências" });
  }
};

exports.uploadEvidence = async (req, res) => {
  const { caseId, type, content, annotations } = req.body;
  const file = req.file;

  try {
    // Verifica campos obrigatórios
    if (!caseId || !type) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios: caseId e type." });
    }

    // Verifica se o caso existe
    const caso = await Case.findById(caseId);
    if (!caso) {
      return res.status(404).json({ message: "Caso não encontrado." });
    }

    // Verifica se o tipo exige conteúdo de texto
    if (type === "texto" && !content) {
      return res.status(400).json({
        message: "Conteúdo é obrigatório para evidências do tipo texto.",
      });
    }

    // Se annotations estiver presente, faz a validação para evitar erro de split
    const parsedAnnotations =
      annotations && typeof annotations === "string"
        ? annotations.split(",").map((a) => a.trim())
        : [];

    const evidence = new Evidence({
      caseId,
      type,
      filePath: file ? file.path : undefined,
      content: type === "texto" ? content : undefined,
      annotations: parsedAnnotations,
      uploadedBy: req.user.id,
    });

    await evidence.save();

    // Atualiza o caso com a nova evidência
    await Case.findByIdAndUpdate(
      caseId,
      { $push: { evidences: evidence._id } },
      { new: true }
    );

    await ActivityLog.create({
      userId: req.user.id,
      action: "Evidência adicionada",
      details: evidence._id,
    });

    // Retorna a evidência populada
    const populatedEvidence = await Evidence.findById(evidence._id)
      .populate("uploadedBy", "name email")
      .populate("caseId", "title type");

    res.status(201).json({
      message: "Evidência adicionada com sucesso",
      data: populatedEvidence,
    });
  } catch (error) {
    logger.error("Erro ao adicionar evidência:", error);
    res
      .status(500)
      .json({ message: "Erro no servidor ao salvar a evidência." });
  }
};

exports.getEvidencesByCategory = async (req, res) => {
  try {
    const { categoria, caseId } = req.query;
    const filtro = {};

    if (categoria) filtro.type = categoria;
    if (caseId) filtro.caseId = caseId;

    const evidencias = await Evidence.find(filtro)
      .populate("uploadedBy", "name email")
      .populate("caseId", "title type");

    res.status(200).json({
      message: "Evidências recuperadas com sucesso",
      data: evidencias,
    });
  } catch (error) {
    logger.error("Erro ao buscar evidências:", error);
    res.status(500).json({ message: "Erro ao buscar evidências" });
  }
};
