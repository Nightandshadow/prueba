/**
 * Rutas de autenticación: registro, login, me.
 */

const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { registerRules, loginRules, validate } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.get('/me', verifyToken, authController.me);

module.exports = router;
