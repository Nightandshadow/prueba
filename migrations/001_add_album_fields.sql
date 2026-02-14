-- Migración: añadir campos de álbum a products (ejecutar si la tabla ya existía)
-- psql -U postgres -d ecommerce_db -f migrations/001_add_album_fields.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS artista VARCHAR(200);
ALTER TABLE products ADD COLUMN IF NOT EXISTS imagen VARCHAR(500);
ALTER TABLE products ADD COLUMN IF NOT EXISTS genero VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS anio INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS num_canciones INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS info_relevante TEXT;
