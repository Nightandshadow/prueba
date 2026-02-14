-- Script de creación de tablas para el proyecto e-commerce
-- Ejecutar en PostgreSQL: psql -U postgres -d ecommerce_db -f crear_tablas.sql

-- Tabla de usuarios (Evaluación 2: Login)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'usuario')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos (Evaluación 3 + álbumes: carátula, género, año, artista)
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

-- Tabla carrito: un registro por item (user_id + product_id + cantidad)
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Tabla de órdenes (historial de compras)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_intent VARCHAR(255)
);

-- Items de cada orden
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL
);

-- Índices para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
