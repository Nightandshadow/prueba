/**
 * Middleware de autenticación JWT y verificación de rol admin.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_por_defecto_cambiar';

/**
 * Verifica que el request tenga un token JWT válido.
 * Añade req.user con { id, email, rol }.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o formato inválido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Usar los datos del token directamente para evitar consulta extra
    req.user = { id: decoded.userId, rol: decoded.rol };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

/**
 * Requiere que el usuario autenticado tenga rol 'admin'.
 * Debe usarse después de verifyToken.
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado. Se requiere rol administrador.' });
};

module.exports = {
  verifyToken,
  isAdmin,
  JWT_SECRET,
};
