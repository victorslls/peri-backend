const logger = require('../utils/logger');
const multer = require('multer'); // Adicione esta linha

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url}`);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: 'Erro no upload de arquivo' });
  }
  res.status(err.status || 500).json({ msg: err.message || 'Erro interno do servidor' });
};

module.exports = errorHandler;