/**
 * Configuración de conexión a PostgreSQL con manejo de errores mejorado
 */

const { Pool } = require('pg');

let pool = null;

const createPool = () => {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está configurada en las variables de entorno');
    return null;
  }

  try {
    // Limpiar la URL de la base de datos (eliminar espacios, saltos de línea)
    const dbUrl = process.env.DATABASE_URL.trim();
    
    console.log('🔧 Configurando conexión a PostgreSQL...');
    console.log('📊 URL de BD (primeros 20 chars):', dbUrl.substring(0, 20) + '...');

    const poolConfig = {
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false // Importante para Render
      },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Aumentado a 10 segundos
    };

    const newPool = new Pool(poolConfig);

    newPool.on('connect', () => {
      console.log('✅ Conexión a PostgreSQL establecida');
    });

    newPool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de PostgreSQL:', err.message);
    });

    return newPool;
  } catch (err) {
    console.error('❌ Error al crear el pool de conexiones:', err.message);
    return null;
  }
};

// Inicializar pool
pool = createPool();

// Función para probar la conexión
const testConnection = async () => {
  if (!pool) {
    console.error('❌ Pool no inicializado - DATABASE_URL no configurada');
    return false;
  }

  try {
    console.log('🔄 Probando conexión a PostgreSQL...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].time);
    return true;
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    console.error('🔍 Detalles del error:', {
      code: err.code,
      host: err.host,
      port: err.port
    });
    return false;
  }
};

// Middleware para verificar BD antes de cada request
const checkDatabase = async (req, res, next) => {
  if (!pool) {
    return res.status(503).json({ 
      error: 'Base de datos no configurada',
      code: 'DATABASE_NOT_CONFIGURED'
    });
  }

  try {
    const client = await pool.connect();
    client.release();
    next();
  } catch (err) {
    console.error('Error de conexión a BD:', err.message);
    return res.status(503).json({ 
      error: 'Base de datos no disponible',
      code: 'DATABASE_UNAVAILABLE'
    });
  }
};

// Función segura para query que maneja pool nulo
const query = async (text, params) => {
  if (!pool) {
    throw new Error('Base de datos no configurada');
  }
  
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Error en query:', err.message);
    throw err;
  }
};

module.exports = {
  query,
  getPool: () => pool,
  testConnection,
  checkDatabase,
};
