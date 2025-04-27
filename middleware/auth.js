// middleware/auth.js
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const auth = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ msg: "Header de autorização ausente" });
    }
    
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Formato de token inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Permissão negada para este recurso" });
      }
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: "Token expirado", expired: true });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: "Token inválido ou mal-formado" });
      }
      
      logger.error("Erro na autenticação:", error);
      res.status(401).json({ msg: "Falha na autenticação" });
    }
  };
};

module.exports = auth;