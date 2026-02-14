/**
 * Controlador de órdenes: historial de compras del usuario autenticado.
 */

const Order = require('../models/Order');

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.getOrdersByUserId(userId);
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItemsByOrderId(order.id);
        return { ...order, items };
      })
    );
    res.json(ordersWithItems);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyOrders,
};
