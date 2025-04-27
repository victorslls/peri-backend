const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  type: { type: String, enum: ['imagem', 'texto'], required: true },
  filePath: { type: String }, // Para imagens
  content: { type: String },  // Para texto
  annotations: [{ type: String }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);