/**
 * Rutas de pagos Stripe: crear sesión Checkout y confirmar pago (crear orden y vaciar carrito).
 */

const express = require('express');
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', verifyToken, paymentController.createCheckoutSession);
router.post('/confirm', verifyToken, paymentController.confirmPayment);

module.exports = router;
