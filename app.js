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

// Configuración CORS mejorada
app.use(cors({
  origin: true, // Permite cualquier origen en desarrollo
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

// Ruta de health check mejorada para Render
app.get('/health', async (req, res) => {
  const dbStatus = process.env.DATABASE_URL ? 'configurada' : 'no configurada';
  let dbConnected = false;
  
  if (process.env.DATABASE_URL) {
    try {
      dbConnected = await testConnection();
    } catch (err) {
      console.error('Health check - Error BD:', err.message);
    }
  }
  
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      configured: !!process.env.DATABASE_URL,
      connected: dbConnected
    },
    port: PORT
  });
});

// Manejo de errores centralizado
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    // Probar conexión a BD si está configurada
    if (process.env.DATABASE_URL) {
      console.log('🔄 Verificando conexión a base de datos...');
      const connected = await testConnection();
      
      if (connected) {
        console.log('✅ Base de datos conectada correctamente');
        // Ejecutar seed si es necesario
        if (process.env.NODE_ENV === 'production') {
          await seedIfNeeded();
        }
      } else {
        console.warn('⚠️ No se pudo conectar a la base de datos, pero el servidor seguirá funcionando');
      }
    } else {
      console.warn('⚠️ DATABASE_URL no configurada - las funciones de BD no estarán disponibles');
    }

    app.listen(PORT, '0.0.0.0', () => { // Escuchar en todas las interfaces
      console.log('\n' + '=' .repeat(50));
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📁 Archivos estáticos: ${path.join(__dirname, 'public')}`);
      console.log(`🌍 Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
      console.log(`🔄 Health check: http://localhost:${PORT}/health`);
      console.log('=' .repeat(50) + '\n');
    });
  } catch (err) {
    console.error('❌ Error al iniciar servidor:', err.message);
    // El servidor igual intenta iniciar para el health check
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️ Servidor iniciado con errores en http://localhost:${PORT}`);
    });
  }
}

startServer();

module.exports = app;
