-- Ejecutar todos los scripts de inserción de productos
-- Ejecutar en orden: 1, 2, 3, 4, rock_clasico

\i insertar_productos_parte1.sql
\i insertar_productos_parte2.sql
\i insertar_productos_parte3.sql
\i insertar_productos_parte4.sql
\i insertar_productos_rock_clasico.sql

-- Mensaje final
SELECT 'Todos los productos han sido insertados correctamente.' AS resultado;
