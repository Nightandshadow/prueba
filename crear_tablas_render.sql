-- Script para crear tablas en la base de datos de Render
-- Ejecutar primero: psql $DATABASE_URL -f crear_tablas_render.sql

-- Crear tablas (Evaluación 2: Login)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos (Evaluación 3 + álbumes: carátula, género, año, artista)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
  descripcion TEXT,
  artista VARCHAR(200),
  imagen VARCHAR(500),
  genero VARCHAR(100),
  anio INTEGER,
  num_canciones INTEGER,
  info_relevante TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla carrito: un registro por item (user_id + product_id + cantidad)
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Crear tabla de órdenes (historial de compras)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_intent VARCHAR(255)
);

-- Crear items de cada orden
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL
);

-- Crear índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Mensaje de confirmación
SELECT 'Tablas creadas correctamente en la base de datos de Render.' AS resultado;
