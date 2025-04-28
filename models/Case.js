const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["acidente", "identificacao", "criminal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["em_andamento", "finalizado", "arquivado"],
      default: "em_andamento",
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: { type: Date, required: true, default: Date.now },
    historico: { type: String },
    analises: { type: String },
    evidences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Evidence" }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para contar o número de evidências
caseSchema.virtual("evidenceCount").get(function () {
  return this.evidences ? this.evidences.length : 0;
});

// Virtual para contar o número de laudos
caseSchema.virtual("reportCount").get(function () {
  return this.reports ? this.reports.length : 0;
});

module.exports = mongoose.model("Case", caseSchema);
