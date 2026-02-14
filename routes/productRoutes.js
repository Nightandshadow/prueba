/**
 * Rutas de productos. GET públicas (con token), POST solo admin.
 */

const express = require('express');
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const { createProductRules, validate } = require('../validators/productValidator');

const router = express.Router();

router.get('/', verifyToken, productController.getAll);
router.get('/:codigo', verifyToken, productController.getByCode);
router.post('/', verifyToken, isAdmin, createProductRules, validate, productController.create);

module.exports = router;
