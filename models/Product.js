/**
 * Modelo de producto (álbum). Operaciones sobre la tabla products.
 */

const { query } = require('../config/db');

const COLS = 'id, codigo, nombre, precio, descripcion, artista, imagen, genero, anio, num_canciones, info_relevante, created_at';

/**
 * Obtiene todos los productos ordenados
 * @returns {Promise<Array>} Lista de productos
 */
const findAll = async () => {
  try {
    const result = await query(
      `SELECT ${COLS} FROM products
       ORDER BY COALESCE(genero, '') ASC, anio ASC NULLS LAST, created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error en Product.findAll:', error.message);
    throw error;
  }
};

/**
 * Busca un producto por su código
 * @param {string} codigo - Código único del producto
 * @returns {Promise<Object>} Producto encontrado o null
 */
const findByCode = async (codigo) => {
  try {
    const result = await query(
      `SELECT ${COLS} FROM products WHERE codigo = $1`,
      [codigo]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en Product.findByCode:', error.message);
    throw error;
  }
};

/**
 * Busca un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto encontrado o null
 */
const findById = async (id) => {
  try {
    const result = await query(
      `SELECT ${COLS} FROM products WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en Product.findById:', error.message);
    throw error;
  }
};

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
const create = async (data) => {
  try {
    const {
      nombre, codigo, precio, descripcion,
      artista, imagen, genero, anio, num_canciones, info_relevante,
    } = data;

    // Validar y convertir valores
    const anioValue = anio != null && anio !== '' ? parseInt(anio, 10) : null;
    const numCancionesValue = num_canciones != null && num_canciones !== '' ? parseInt(num_canciones, 10) : null;
    const precioValue = precio ? parseFloat(precio) : null;

    const result = await query(
      `INSERT INTO products (nombre, codigo, precio, descripcion, artista, imagen, genero, anio, num_canciones, info_relevante)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${COLS}`,
      [
        nombre, 
        codigo, 
        precioValue, 
        descripcion || null,
        artista || null, 
        imagen || null, 
        genero || null,
        anioValue,
        numCancionesValue,
        info_relevante || null,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en Product.create:', error.message);
    throw error;
  }
};

module.exports = {
  findAll,
  findByCode,
  findById,
  create,
};