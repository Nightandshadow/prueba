/**
 * Modelo de usuario. Operaciones sobre la tabla users.
 */

const { query } = require('../config/db');

/**
 * Busca un usuario por su email
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>} Usuario encontrado o null
 */
const findByEmail = async (email) => {
  try {
    const result = await query(
      'SELECT id, nombre, email, password, rol, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en User.findByEmail:', error.message);
    throw error;
  }
};

/**
 * Busca un usuario por su ID
 * @param {number} id - ID del usuario
 * @returns {Promise<Object>} Usuario encontrado o null
 */
const findById = async (id) => {
  try {
    const result = await query(
      'SELECT id, nombre, email, rol, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error en User.findById:', error.message);
    throw error;
  }
};

/**
 * Crea un nuevo usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} passwordHash - Hash de la contraseña
 * @param {string} rol - Rol del usuario (admin/usuario)
 * @returns {Promise<Object>} Usuario creado
 */
const create = async (nombre, email, passwordHash, rol) => {
  try {
    const result = await query(
      `INSERT INTO users (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, created_at`,
      [nombre, email, passwordHash, rol]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error en User.create:', error.message);
    throw error;
  }
};

module.exports = {
  findByEmail,
  findById,
  create,
};