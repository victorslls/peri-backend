// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validate } = require("../middleware/validate");
const auth = require("../middleware/auth");
const Joi = require("joi");

// Schema de validação para registro
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "perito", "assistente"),
});

// Schema de validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Schema de validação para refresh token
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Rotas que não precisam de autenticação
router.post("/register", validate(registerSchema), userController.registerUser);
router.post("/login", validate(loginSchema), userController.loginUser);
router.get("/me", auth(), userController.getMe);
router.post("/forgotpassword", userController.forgotPassword);
router.put("/reset", userController.resetPassword);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  userController.refreshToken
);
router.get("/", auth(["admin"]), userController.getAllUsers);
router.put("/:id/role", auth(["admin"]), userController.updateUserRole);

// Rotas que precisam de autenticação
router.post("/logout", auth(), userController.logoutUser);

module.exports = router;
