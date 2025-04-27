const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info("MongoDB conectado com sucesso");
  } catch (error) {
    logger.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB desconectado, tentando reconectar...");
  setTimeout(connectDB, 2000);
});

module.exports = connectDB;
