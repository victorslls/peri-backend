const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfPath: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);