/**
 * Modelo de carrito. Operaciones sobre la tabla cart.
 */

const { query } = require('../config/db');

/**
 * Obtiene el carrito de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Items del carrito
 */
const getCart = async (userId) => {
  try {
    const result = await query(
      `SELECT c.id, c.user_id, c.product_id, c.cantidad, c.created_at,
              p.codigo, p.nombre, p.precio, p.descripcion, p.artista, p.imagen
       FROM cart c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error en Cart.getCart:', error.message);
    throw error;
  }
};

/**
 * Añade un item al carrito (o actualiza cantidad si ya existe)
 * @param {number} userId - ID del usuario
 * @param {number} productId - ID del producto
 * @param {number} cantidad - Cantidad a añadir
 * @returns {Promise<Object>} Item añadido/actualizado
 */
const addItem = async (userId, productId, cantidad = 1) => {
  try {
    const result = await query(
      `INSERT INTO cart (user_id, product_id, cantidad)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET cantidad = cart.cantidad + EXCLUDED.cantidad
       RETURNING id, user_id, product_id, cantidad, created_at`,
      [userId, productId, cantidad]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en Cart.addItem:', error.message);
    throw error;
  }
};

/**
 * Actualiza la cantidad de un item en el carrito
 * @param {number} userId - ID del usuario
 * @param {number} cartItemId - ID del item en carrito
 * @param {number} cantidad - Nueva cantidad
 * @returns {Promise<Object>} Item actualizado
 */
const updateQuantity = async (userId, cartItemId, cantidad) => {
  try {
    const result = await query(
      `UPDATE cart SET cantidad = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [cantidad, cartItemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en Cart.updateQuantity:', error.message);
    throw error;
  }
};

/**
 * Elimina un item del carrito
 * @param {number} userId - ID del usuario
 * @param {number} cartItemId - ID del item en carrito
 * @returns {Promise<Object>} Item eliminado
 */
const removeItem = async (userId, cartItemId) => {
  try {
    const result = await query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id',
      [cartItemId, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en Cart.removeItem:', error.message);
    throw error;
  }
};

/**
 * Vacía el carrito de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<void>}
 */
const clearCart = async (userId) => {
  try {
    await query('DELETE FROM cart WHERE user_id = $1', [userId]);
  } catch (error) {
    console.error('Error en Cart.clearCart:', error.message);
    throw error;
  }
};

/**
 * Obtiene el carrito con total calculado
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Carrito con items y total
 */
const getCartWithTotal = async (userId) => {
  try {
    const items = await getCart(userId);
    const total = items.reduce((sum, item) => {
      return sum + (Number(item.precio) * Number(item.cantidad));
    }, 0);
    
    return {
      items,
      total: Number(total.toFixed(2))
    };
  } catch (error) {
    console.error('Error en Cart.getCartWithTotal:', error.message);
    throw error;
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  getCartWithTotal,
};