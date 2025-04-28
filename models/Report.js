const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["laudo_pericial", "relatorio_tecnico", "parecer_odontologico"],
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["rascunho", "finalizado", "arquivado"],
      default: "rascunho",
    },
    attachments: [
      {
        filename: String,
        path: String,
        uploadedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
