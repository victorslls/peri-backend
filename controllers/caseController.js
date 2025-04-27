const Case = require("../models/Case");
const ActivityLog = require("../models/ActivityLog");
const logger = require("../utils/logger");

exports.createCase = async (req, res) => {
  const { title, description, type } = req.body;

  try {
    const newCase = new Case({
      title,
      description,
      type,
      responsible: req.user.id,
      createdBy: req.user.id,
    });

    await newCase.save();
    await ActivityLog.create({
      userId: req.user.id,
      action: "Caso criado",
      details: newCase._id,
    });

    res.status(201).json(newCase);
  } catch (error) {
    logger.error("Erro ao criar caso:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.updateCaseStatus = async (req, res) => {
  const { caseId } = req.params;
  const { status } = req.body;

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { status },
      { new: true }
    );
    if (!updatedCase)
      return res.status(404).json({ msg: "Caso não encontrado" });

    await ActivityLog.create({
      userId: req.user.id,
      action: "Status do caso atualizado",
      details: caseId,
    });
    res.json(updatedCase);
  } catch (error) {
    logger.error("Erro ao atualizar caso:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

exports.getCases = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo) {
      filtro.type = req.query.tipo;
    }
    const casos = await Case.find(filtro);
    res.status(200).json(casos);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar casos.", error });
  }
};
