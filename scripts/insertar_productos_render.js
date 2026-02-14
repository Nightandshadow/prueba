/**
 * Script para insertar productos en la BD de Render.
 * Ejecutar: node scripts/insertar_productos_render.js
 */

require('dotenv').config();
const { query, testConnection } = require('../config/db');

const productos = [
  { codigo: 'PRD001', nombre: 'The Prodigy Experience', artista: 'The Prodigy', genero: 'Electrónica', anio: 1992, num_canciones: 12, info_relevante: 'Portada con fondo negro y cara con rayos láser de colores', precio: 28.99, imagen: '/images/albums/R-26193-1313909388.jpg' },
  { codigo: 'PRD002', nombre: 'The Fat of the Land', artista: 'The Prodigy', genero: 'Electrónica', anio: 1997, num_canciones: 10, info_relevante: 'Fondo negro con cangrejo rojo/anaranjado', precio: 29.99, imagen: '/images/albums/R-26194-1592430767-5429.jpg' },
  { codigo: 'NWA001', nombre: 'Straight Outta Compton', artista: 'N.W.A', genero: 'Hip-Hop', anio: 1988, num_canciones: 13, info_relevante: 'Fondo negro con letras N.W.A en rojo y graffiti', precio: 32.99, imagen: '/images/albums/R-103648-1642412832-5480.jpg' },
  { codigo: 'TFF001', nombre: 'Songs from the Big Chair', artista: 'Tears for Fears', genero: 'Pop', anio: 1985, num_canciones: 8, info_relevante: 'Primer plano de rostro con fondo oscuro y luces de colores', precio: 24.99, imagen: '/images/albums/R-124187-1349004315-5948.jpg' },
  { codigo: 'EMM001', nombre: 'The Eminem Show', artista: 'Eminem', genero: 'Hip-Hop', anio: 2002, num_canciones: 20, info_relevante: 'Fondo gris con cortina de teatro y Eminem en escenario', precio: 31.99, imagen: '/images/albums/R-176346-1571810543-9832.jpg' },
  { codigo: 'DRD001', nombre: 'The Chronic', artista: 'Dr. Dre', genero: 'Hip-Hop', anio: 1992, num_canciones: 16, info_relevante: 'Portada con hoja de marihuana y fondo amarillo', precio: 30.99, imagen: '/images/albums/R-226082-1691001549-9816.jpg' },
  { codigo: 'NLM001', nombre: 'No Limit Compilation', artista: 'No Limit Records', genero: 'Hip-Hop', anio: 1997, num_canciones: 15, info_relevante: 'Compilado con varios artistas de No Limit Records', precio: 28.99, imagen: '/images/albums/R-226365-1154450517.jpg' },
  { codigo: 'TUP001', nombre: 'All Eyez on Me', artista: '2Pac', genero: 'Hip-Hop', anio: 1996, num_canciones: 27, info_relevante: '2Pac con torso desnudo, tatuajes y fondo púrpura', precio: 35.99, imagen: '/images/albums/R-238369-1650818330-8598.jpg' },
  { codigo: '50C001', nombre: 'Get Rich or Die Tryin', artista: '50 Cent', genero: 'Hip-Hop', anio: 2003, num_canciones: 18, info_relevante: '50 Cent con camiseta blanca y cadena de oro', precio: 30.99, imagen: '/images/albums/R-258882-1425707940-8805.jpg' },
  { codigo: 'PNT001', nombre: 'Cowboys from Hell', artista: 'Pantera', genero: 'Heavy Metal', anio: 1990, num_canciones: 12, info_relevante: 'Vaquero esqueleto montando caballo con alas', precio: 31.99, imagen: '/images/albums/R-367301-1610560614-8575.jpg' },
  { codigo: 'RAT001', nombre: 'Rage Against the Machine', artista: 'Rage Against the Machine', genero: 'Rock', anio: 1992, num_canciones: 12, info_relevante: 'Monje budista quemándose', precio: 29.99, imagen: '/images/albums/R-367339-1615037762-7659.jpg' },
  { codigo: 'LBZ001', nombre: 'Significant Other', artista: 'Limp Bizkit', genero: 'Nu Metal', anio: 1999, num_canciones: 14, info_relevante: 'Robot extraterrestre verde y amarillo', precio: 32.99, imagen: '/images/albums/R-367548-1488165844-3409.jpg' },
  { codigo: 'LP001', nombre: 'Hybrid Theory', artista: 'Linkin Park', genero: 'Nu Metal', anio: 2000, num_canciones: 12, info_relevante: 'Soldado con alas de libélula', precio: 33.99, imagen: '/images/albums/R-369408-1245380540.jpg' },
  { codigo: 'MC001', nombre: 'Dr. Feelgood', artista: 'Mötley Crüe', genero: 'Hard Rock', anio: 1989, num_canciones: 10, info_relevante: 'Portada con jeringa y fondo rojo', precio: 30.99, imagen: '/images/albums/R-372153-1510939356-6595.jpg' },
  { codigo: 'NV001', nombre: 'In Utero', artista: 'Nirvana', genero: 'Grunge', anio: 1993, num_canciones: 12, info_relevante: 'Ángel anatómico con alas', precio: 31.99, imagen: '/images/albums/R-375979-1491700347-7263.jpg' },
  { codigo: 'HVN001', nombre: 'Heaven', artista: 'Desconocido', genero: 'Rock', anio: 1990, num_canciones: 10, info_relevante: 'Letras grandes HEAVEN en estilo gótico', precio: 26.99, imagen: '/images/albums/R-376927-1390241414-9337.jpg' },
  { codigo: 'MTL002', nombre: 'Ride the Lightning', artista: 'Metallica', genero: 'Thrash Metal', anio: 1984, num_canciones: 8, info_relevante: 'Portada con silla eléctrica y rayos', precio: 30.99, imagen: '/images/albums/R-377464-1753530613-1176.jpg' },
  { codigo: 'RAT002', nombre: 'Evil Empire', artista: 'Rage Against the Machine', genero: 'Rock', anio: 1996, num_canciones: 11, info_relevante: 'Fondo rojo con hombre con megáfono', precio: 31.99, imagen: '/images/albums/R-377569-1401732089-7989.jpg' },
  { codigo: 'DFT001', nombre: 'Around the Fur', artista: 'Deftones', genero: 'Nu Metal', anio: 1997, num_canciones: 10, info_relevante: 'Chica con cabello mojado y fondo azul/verde', precio: 29.99, imagen: '/images/albums/R-379025-1384964856-3772.jpg' },
  { codigo: 'RAT003', nombre: 'The Battle of Los Angeles', artista: 'Rage Against the Machine', genero: 'Rock', anio: 1999, num_canciones: 12, info_relevante: 'Brazo robótico sosteniendo bandera', precio: 32.99, imagen: '/images/albums/R-395120-1766349225-9160.jpg' },
  { codigo: 'XZB001', nombre: 'Restless', artista: 'Xzibit', genero: 'Hip-Hop', anio: 1996, num_canciones: 14, info_relevante: 'Auto lowrider y fondo oscuro', precio: 27.99, imagen: '/images/albums/R-406060-1282167150.jpg' },
  { codigo: 'IM002', nombre: 'Fear of the Dark (Remix)', artista: 'Iron Maiden', genero: 'Heavy Metal', anio: 1993, num_canciones: 8, info_relevante: 'Eddie en bosque oscuro, remezclado por Dennis', precio: 31.99, imagen: '/images/albums/R-408154-1281331335.jpg' },
  { codigo: 'PNT002', nombre: 'The Great Southern Trendkill', artista: 'Pantera', genero: 'Heavy Metal', anio: 1996, num_canciones: 10, info_relevante: 'Portada con gallo y fondo amarillo', precio: 32.99, imagen: '/images/albums/R-510962-1310496946.jpg' },
  { codigo: 'MTL004', nombre: '...And Justice for All', artista: 'Metallica', genero: 'Thrash Metal', anio: 1988, num_canciones: 9, info_relevante: 'Estatua de la justicia rota', precio: 31.99, imagen: '/images/albums/R-521407-1530044171-6726.jpg' },
  { codigo: 'DSB001', nombre: 'Ten Thousand Fists', artista: 'Disturbed', genero: 'Hard Rock', anio: 2005, num_canciones: 12, info_relevante: 'Puño robótico gigante y multitudes', precio: 33.99, imagen: '/images/albums/R-525185-1713794276-1309.jpg' },
  { codigo: 'KRN001', nombre: 'Follow the Leader', artista: 'Korn', genero: 'Nu Metal', anio: 1998, num_canciones: 14, info_relevante: 'Niños en fila y fondo de caricatura', precio: 32.99, imagen: '/images/albums/R-527932-1338428652-4532.jpg' },
  { codigo: 'SYS001', nombre: 'Toxicity', artista: 'System of a Down', genero: 'Nu Metal', anio: 2001, num_canciones: 14, info_relevante: 'Bomba de mano con letras rojas', precio: 33.99, imagen: '/images/albums/R-532695-1575404286-9654.jpg' },
  { codigo: 'SLP001', nombre: 'Iowa', artista: 'Slipknot', genero: 'Nu Metal', anio: 2001, num_canciones: 12, info_relevante: 'Goat con corazón sangrando', precio: 34.99, imagen: '/images/albums/R-541699-1465900859-2847.jpg' },
  { codigo: 'MTL003', nombre: 'Garage Inc', artista: 'Metallica', genero: 'Heavy Metal', anio: 1998, num_canciones: 27, info_relevante: 'Tumba de garaje estilo cementerio', precio: 34.99, imagen: '/images/albums/R-421601-1588467637-9832.jpg' }
];

async function insertarProductos() {
  console.log('=== Insertando productos en BD de Render ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no configurada.');
    process.exit(1);
  }

  // Probar conexión
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ No se pudo conectar a la base de datos');
    process.exit(1);
  }

  try {
    // Verificar si tabla products existe
    const tableCheck = await query('SELECT to_regclass(\'public.products\') AS products_table');
    console.log('✅ Tabla products:', tableCheck.rows[0]);

    // Limpiar productos existentes
    console.log('🧹 Limpiando productos existentes...');
    await query('DELETE FROM products');

    // Insertar productos
    console.log(`📦 Insertando ${productos.length} productos...`);
    for (const producto of productos) {
      await query(
        `INSERT INTO products (codigo, nombre, artista, genero, anio, num_canciones, info_relevante, precio, imagen, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [producto.codigo, producto.nombre, producto.artista, producto.genero, producto.anio, producto.num_canciones, producto.info_relevante, producto.precio, producto.imagen]
      );
    }

    // Verificar inserción
    const count = await query('SELECT COUNT(*) as total FROM products');
    console.log(`✅ ${count.rows[0].total} productos insertados correctamente.`);

    console.log('\n🎉 Productos listos para usar en la API.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.detail) console.error('Detalle:', err.detail);
    process.exit(1);
  }
}

if (require.main === module) {
  insertarProductos();
}