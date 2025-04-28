const Joi = require("joi");

exports.validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      // Log para debug
      console.log(
        `Validando ${source}:`,
        source === "params" ? req.params : req.body
      );

      const dataToValidate = source === "params" ? req.params : req.body;
      const { error } = schema.validate(dataToValidate, { abortEarly: false });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        console.error("Erros de validação:", errors);

        return res.status(400).json({
          success: false,
          message: errors[0],
          errors: errors,
          validation: error.details.reduce((acc, detail) => {
            acc[detail.path[0]] = detail.message;
            return acc;
          }, {}),
        });
      }

      next();
    } catch (err) {
      console.error("Erro no middleware de validação:", err);
      res.status(500).json({
        success: false,
        message: "Erro interno na validação",
        error: err.message,
      });
    }
  };
};
