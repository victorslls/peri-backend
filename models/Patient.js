const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "É necessário vincular o paciente a um caso"],
      unique: true,
    },
    numberOfTeeth: {
      type: Number,
      required: [true, "O número de dentes é obrigatório"],
      min: [0, "O número de dentes não pode ser negativo"],
      max: [32, "O número de dentes não pode ser maior que 32"],
    },
    hasActiveCavities: {
      type: Boolean,
      required: [true, "A informação sobre cáries ativas é obrigatória"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para indicar se o paciente é identificado
patientSchema.virtual("isIdentified").get(function () {
  return !!this.name;
});

// Virtual para o status de identificação em texto
patientSchema.virtual("identificationStatus").get(function () {
  return this.name ? "Paciente identificado" : "Paciente não identificado";
});

// Middleware para garantir que updatedBy seja definido antes de salvar
patientSchema.pre("save", function (next) {
  if (this.isNew) {
    this.updatedBy = this.createdBy;
  }
  next();
});

// Middleware para atualizar a referência no Case após salvar o Patient
patientSchema.post("save", async function (doc) {
  await mongoose
    .model("Case")
    .findByIdAndUpdate(doc.case, { patient: doc._id });
});

// Middleware para remover a referência no Case quando o Patient for removido
patientSchema.pre("remove", async function () {
  await mongoose
    .model("Case")
    .findByIdAndUpdate(this.case, { $unset: { patient: "" } });
});

module.exports = mongoose.model("Patient", patientSchema);
