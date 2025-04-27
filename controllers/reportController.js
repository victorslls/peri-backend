const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');
const generatePDF = require('../utils/pdfGenerator');
const logger = require('../utils/logger');

exports.createReport = async (req, res) => {
  const { caseId, content, attachments } = req.body;

  try {
    const report = new Report({
      caseId,
      content,
      attachments: attachments || [],
      generatedBy: req.user.id,
    });

    const pdfPath = `${process.env.UPLOAD_DIR}/report-${report._id}.pdf`;
    await generatePDF({ content }, pdfPath);
    report.pdfPath = pdfPath;

    await report.save();
    await ActivityLog.create({ userId: req.user.id, action: 'Laudo gerado', details: report._id });

    res.status(201).json(report);
  } catch (error) {
    logger.error('Erro ao gerar laudo:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};