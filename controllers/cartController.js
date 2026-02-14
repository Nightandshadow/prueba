/**
 * Controlador de carrito: ver, agregar, vaciar. Solo el usuario autenticado accede a su carrito.
 */

const Cart = require('../models/Cart');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getCart(userId);
    res.json(cartItems);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, cantidad = 1 } = req.body;
    await Cart.addItem(userId, product_id, cantidad);
    res.status(201).json({ message: 'Producto añadido al carrito.' });
  } catch (err) {
    next(err);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { cantidad } = req.body;
    const qty = Number(cantidad);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ error: 'Cantidad inválida.' });
    }
    const updated = await Cart.updateQuantity(userId, cartItemId, qty);
    res.json({ message: 'Cantidad actualizada.', item: updated });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const cartItems = await Cart.getCart(userId);
    const item = cartItems.find(i => i.product_id == productId);
    if (!item) {
      return res.status(404).json({ error: 'Ítem no encontrado en el carrito.' });
    }
    await Cart.removeItem(userId, item.id);
    res.json({ message: 'Ítem eliminado del carrito.' });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Cart.clearCart(userId);
    res.json({ message: 'Carrito vaciado.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart
};
