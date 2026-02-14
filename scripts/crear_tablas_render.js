/**
 * Script para crear tablas en la BD de Render
 * Ejecutar: node scripts/crear_tablas_render.js
 */

require('dotenv').config();
const { query, testConnection } = require('../config/db');

async function crearTablas() {
  console.log('\n' + '=' .repeat(50));
  console.log('🎬 CREANDO TABLAS EN BASE DE DATOS');
  console.log('=' .repeat(50) + '\n');
  
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ NO CONFIGURADA');
  
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ ERROR: DATABASE_URL no configurada.');
    console.log('\n💡 Solución:');
    console.log('1. Ve a tu base de datos en Render');
    console.log('2. Copia la "Internal Database URL"');
    console.log('3. Pégala en el archivo .env como DATABASE_URL\n');
    process.exit(1);
  }

  // Probar conexión
  console.log('\n🔄 Probando conexión a la base de datos...');
  const connected = await testConnection();
  
  if (!connected) {
    console.error('\n❌ ERROR: No se pudo conectar a la base de datos');
    console.log('\n💡 Solución:');
    console.log('1. Verifica que la URL de la base de datos sea correcta');
    console.log('2. Asegúrate de que la base de datos esté activa en Render');
    console.log('3. Espera unos minutos y vuelve a intentar\n');
    process.exit(1);
  }

  console.log('\n✅ Conexión exitosa. Creando tablas...\n');

  try {
    // Crear tabla users
    console.log('📝 Creando tabla users...');
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'usuario',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla users creada');

    // Crear tabla products
    console.log('\n📦 Creando tabla products...');
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        artista VARCHAR(255),
        genero VARCHAR(100),
        anio INTEGER,
        num_canciones INTEGER,
        info_relevante TEXT,
        precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
        imagen VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla products creada');

    // Crear tabla cart
    console.log('\n🛒 Creando tabla cart...');
    await query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `);
    console.log('✅ Tabla cart creada');

    // Crear tabla orders
    console.log('\n📋 Creando tabla orders...');
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
        fecha TIMESTAMP DEFAULT NOW(),
        stripe_payment_intent VARCHAR(255)
      )
    `);
    console.log('✅ Tabla orders creada');

    // Crear tabla order_items
    console.log('\n📦 Creando tabla order_items...');
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        cantidad INTEGER NOT NULL CHECK (cantidad > 0),
        precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0)
      )
    `);
    console.log('✅ Tabla order_items creada');

    console.log('\n' + '=' .repeat(50));
    console.log('✅ ¡TODAS LAS TABLAS CREADAS CORRECTAMENTE!');
    console.log('=' .repeat(50) + '\n');
    
  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    if (err.detail) console.error('📋 Detalle:', err.detail);
    console.log('\n💡 Verifica que la URL de la base de datos sea correcta');
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  crearTablas();
}
