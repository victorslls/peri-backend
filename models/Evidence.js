const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    type: { type: String, enum: ["imagem", "texto"], required: true },
    filePaths: [{ type: String }], // Alterado para array de caminhos
    content: { type: String },
    annotations: [{ type: String }],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evidence", evidenceSchema);
