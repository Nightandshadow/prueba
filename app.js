/**
 * Punto de entrada de la aplicación.
 * Servidor Express con API REST y archivos estáticos.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { testConnection } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { seedIfNeeded } = require('./scripts/seed_render_free');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS
const frontendUrl = process.env.FRONTEND_URL || `http://localhost:${PORT}`;
const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = isProduction ? frontendUrl : '*';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar BD en rutas que la necesitan
app.use('/api', (req, res, next) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ 
      error: 'Base de datos no configurada',
      code: 'DATABASE_NOT_CONFIGURED'
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Ruta raíz: servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de health check para Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'configurada' : 'no configurada'
  });
});

// Manejo de errores centralizado
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    // Probar conexión a BD
    if (process.env.DATABASE_URL) {
      await testConnection();
      // Ejecutar seed en producción
      if (isProduction) {
        await seedIfNeeded();
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📁 Archivos estáticos: ${path.join(__dirname, 'public')}`);
      console.log(`🌍 Modo: ${isProduction ? 'producción' : 'desarrollo'}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar servidor:', err.message);
    // No detener el servidor, solo loguear
    app.listen(PORT, () => {
      console.log(`⚠️ Servidor iniciado pero BD no disponible en http://localhost:${PORT}`);
    });
  }
}

startServer();

module.exports = app;