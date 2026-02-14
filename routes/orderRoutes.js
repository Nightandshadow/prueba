/**
 * Rutas de órdenes. Historial del usuario autenticado.
 */

const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, orderController.getMyOrders);

module.exports = router;
