const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['acidente', 'identificacao', 'criminal'], required: true },
  status: { type: String, enum: ['em_andamento', 'finalizado', 'arquivado'], default: 'em_andamento' },
  responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);