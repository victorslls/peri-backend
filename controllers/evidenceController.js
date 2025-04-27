const Evidence = require("../models/Evidence");
const ActivityLog = require("../models/ActivityLog");
const logger = require("../utils/logger");

exports.listarEvidencias = (req, res) => {
  res.send("Lista de evidências");
};

exports.uploadEvidence = async (req, res) => {
  const { caseId, type, content, annotations } = req.body;
  const file = req.file;

  try {
    // Verifica campos obrigatórios
    if (!caseId || !type) {
      return res
        .status(400)
        .json({ msg: "Campos obrigatórios: caseId e type." });
    }

    // Verifica se o tipo exige conteúdo de texto
    if (type === "texto" && !content) {
      return res
        .status(400)
        .json({ msg: "Conteúdo é obrigatório para evidências do tipo texto." });
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

    await ActivityLog.create({
      userId: req.user.id,
      action: "Evidência adicionada",
      details: evidence._id,
    });

    res.status(201).json(evidence);
  } catch (error) {
    logger.error("Erro ao adicionar evidência:", error);
    res.status(500).json({ msg: "Erro no servidor ao salvar a evidência." });
  }
};

exports.getEvidencesByCategory = async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria } : {};
    const evidencias = await Evidence.find(filtro);
    res.status(200).json(evidencias);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar evidências.", error });
  }
};
