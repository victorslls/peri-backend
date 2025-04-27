const mongoose = require("mongoose");

const dentalRecordSchema = new mongoose.Schema(
  {
    patientName: { type: String },
    isIdentified: { type: Boolean, default: false },
    dentalData: { type: Map, of: String }, // Ex.: {"dente_11": "caries"}
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

dentalRecordSchema.index({ patientName: "text" });

module.exports = mongoose.model("DentalRecord", dentalRecordSchema);
