const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validators');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/perfil', authMiddleware, authController.perfil);

// TEMPORÁRIO - remover antes de produção
router.post('/register-dev', authController.registerDev);

module.exports = router;