/**
 * Controlador de pagos con Stripe. Crear sesión Checkout y webhook/confirmar pago.
 * Al confirmar: mover carrito a orden, vaciar carrito.
 */

const Stripe = require('stripe');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

/**
 * Crear sesión de Stripe Checkout. El frontend redirige al usuario a Stripe.
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getCart(userId);
    if (!cartItems.length) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.nombre,
          description: item.descripcion || undefined,
          images: [],
        },
        unit_amount: Math.round(Number(item.precio) * 100),
      },
      quantity: item.cantidad,
    }));
    const totalCents = cartItems.reduce(
      (sum, item) => sum + Math.round(Number(item.precio) * 100) * item.cantidad,
      0
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.body.success_url || req.headers.origin || ''}/cart.html?payment=success`,
      cancel_url: `${req.body.cancel_url || req.headers.origin || ''}/cart.html?payment=cancel`,
      metadata: {
        user_id: String(userId),
        total_cents: String(totalCents),
      },
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
};

/**
 * Confirmar pago: se llama desde el frontend tras éxito de Stripe (o simular).
 * Crea la orden con los items del carrito, vacía el carrito.
 */
const confirmPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.getCart(userId);
    if (!cartItems.length) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }
    const stripePaymentIntent = req.body.payment_intent_id || req.body.session_id || null;
    const order = await Order.createOrderWithItems(userId, cartItems, stripePaymentIntent);
    await Cart.clearCart(userId);
    res.status(201).json({
      message: 'Pago confirmado. Orden creada.',
      order: { id: order.id, total: order.total, fecha: order.fecha },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCheckoutSession,
  confirmPayment,
};
