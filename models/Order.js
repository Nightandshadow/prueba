/**
 * Modelo de órdenes e items. Operaciones sobre orders y order_items.
 */

const { query } = require('../config/db');

/**
 * Crea una nueva orden
 * @param {number} userId - ID del usuario
 * @param {number} total - Total de la orden
 * @param {string} stripePaymentIntent - ID del payment intent de Stripe
 * @returns {Promise<Object>} Orden creada
 */
const createOrder = async (userId, total, stripePaymentIntent = null) => {
  const client = await query('BEGIN'); // No podemos usar transacciones con query simple
  
  try {
    const orderResult = await query(
      `INSERT INTO orders (user_id, total, stripe_payment_intent)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total, fecha, stripe_payment_intent`,
      [userId, total, stripePaymentIntent]
    );
    return orderResult.rows[0];
  } catch (error) {
    console.error('Error en Order.createOrder:', error.message);
    throw error;
  }
};

/**
 * Crea una orden con sus items (transacción)
 * @param {number} userId - ID del usuario
 * @param {Array} cartItems - Items del carrito
 * @param {string} stripePaymentIntent - ID del payment intent
 * @returns {Promise<Object>} Orden creada
 */
const createOrderWithItems = async (userId, cartItems, stripePaymentIntent = null) => {
  const pool = require('../config/db').getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Calcular total
    let total = 0;
    for (const item of cartItems) {
      total += Number(item.precio) * Number(item.cantidad);
    }
    
    // Crear orden
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, stripe_payment_intent)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total, fecha`,
      [userId, total, stripePaymentIntent]
    );
    const order = orderResult.rows[0];
    
    // Insertar items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.cantidad, item.precio]
      );
    }
    
    await client.query('COMMIT');
    return order;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error en Order.createOrderWithItems:', e.message);
    throw e;
  } finally {
    client.release();
  }
};

/**
 * Obtiene todas las órdenes de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de órdenes
 */
const getOrdersByUserId = async (userId) => {
  try {
    const result = await query(
      `SELECT id, user_id, total, fecha, stripe_payment_intent
       FROM orders 
       WHERE user_id = $1 
       ORDER BY fecha DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error en Order.getOrdersByUserId:', error.message);
    throw error;
  }
};

/**
 * Obtiene los items de una orden
 * @param {number} orderId - ID de la orden
 * @returns {Promise<Array>} Items de la orden
 */
const getOrderItemsByOrderId = async (orderId) => {
  try {
    const result = await query(
      `SELECT oi.id, oi.order_id, oi.product_id, oi.cantidad, oi.precio_unitario,
              p.nombre, p.codigo, p.artista, p.imagen
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error en Order.getOrderItemsByOrderId:', error.message);
    throw error;
  }
};

/**
 * Obtiene una orden por ID verificando que pertenezca al usuario
 * @param {number} orderId - ID de la orden
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Orden encontrada o null
 */
const getOrderByIdAndUser = async (orderId, userId) => {
  try {
    const result = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en Order.getOrderByIdAndUser:', error.message);
    throw error;
  }
};

/**
 * Obtiene órdenes completas con sus items
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Órdenes con items
 */
const getOrdersWithItems = async (userId) => {
  try {
    const orders = await getOrdersByUserId(userId);
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await getOrderItemsByOrderId(order.id);
        return { ...order, items };
      })
    );
    
    return ordersWithItems;
  } catch (error) {
    console.error('Error en Order.getOrdersWithItems:', error.message);
    throw error;
  }
};

module.exports = {
  createOrder,
  createOrderWithItems,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  getOrderByIdAndUser,
  getOrdersWithItems,
};