const Report = require("../models/Report");
const Case = require("../models/Case");
const ActivityLog = require("../models/ActivityLog");
const generatePDF = require("../utils/pdfGenerator");
const logger = require("../utils/logger");

exports.createReport = async (req, res) => {
  try {
    console.log("Corpo da requisição:", req.body);
    console.log("Arquivos recebidos:", req.files);

    const { case: caseId, title, content, type, status } = req.body;

    if (!caseId) {
      return res.status(400).json({ message: "ID do caso é obrigatório" });
    }

    const files = req.files;

    const caso = await Case.findById(caseId);
    if (!caso) {
      return res.status(404).json({ message: "Caso não encontrado" });
    }

    // Verificar permissão
    if (
      req.user.role !== "admin" &&
      caso.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Sem permissão para criar laudo neste caso",
      });
    }

    // Processar anexos
    const attachments = files
      ? files.map((file) => ({
          filename: file.originalname,
          path: file.path,
          uploadedAt: new Date(),
        }))
      : [];

    const report = new Report({
      case: caseId,
      title,
      content,
      type,
      status: status || "rascunho",
      createdBy: req.user.id,
      attachments,
    });

    const pdfPath = `${process.env.UPLOAD_DIR}/report-${report._id}.pdf`;
    await generatePDF({ content }, pdfPath);
    report.pdfPath = pdfPath;

    await report.save();

    // Atualiza o caso com o novo laudo
    await Case.findByIdAndUpdate(
      caseId,
      { $push: { reports: report._id } },
      { new: true }
    );

    await ActivityLog.create({
      userId: req.user.id,
      action: "Laudo gerado",
      details: report._id,
    });

    // Retorna o laudo populado
    const populatedReport = await Report.findById(report._id)
      .populate("createdBy", "name email")
      .populate("case", "title type");

    return res.status(201).json({
      success: true,
      data: populatedReport,
    });
  } catch (error) {
    console.error("Erro ao criar laudo:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar laudo",
      error: error.message,
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { caseId } = req.query;
    let query = {};

    if (caseId) {
      query.case = caseId;
    }

    // Se não for admin, só pode ver laudos dos seus casos
    if (req.user.role !== "admin") {
      const userCases = await Case.find({ createdBy: req.user.id });
      const userCaseIds = userCases.map((c) => c._id);
      query.case = { $in: userCaseIds };
    }

    const reports = await Report.find(query)
      .populate("case", "title type")
      .populate("createdBy", "name");

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("Erro ao buscar laudos:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar laudos",
      error: error.message,
    });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId).populate("case");

    if (!report) {
      return res.status(404).json({ message: "Laudo não encontrado" });
    }

    // Verificar permissão
    if (
      req.user.role !== "admin" &&
      report.case.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Sem permissão para baixar este laudo" });
    }

    // Aqui você pode implementar a lógica de download do arquivo
    // Por enquanto, vamos retornar os dados do laudo
    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Erro ao baixar laudo:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao baixar laudo",
      error: error.message,
    });
  }
};
