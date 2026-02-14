/**
 * Controlador de autenticación: registro y login.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password.' });
    }

    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: 'Servicio no disponible. Base de datos no configurada.',
        code: 'NO_DATABASE'
      });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create(nombre, email, hash, rol || 'usuario');
    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    console.log('Usuario creado:', { id: user.id, nombre: user.nombre, email: user.email });
    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token
    });
  } catch (err) {
    console.error('Error en registro:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      where: err.where,
    });
    
    // Manejar errores de BD específicos
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Base de datos no disponible. Intente más tarde.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
    
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: 'Servicio no disponible. Base de datos no configurada.',
        code: 'NO_DATABASE'
      });
    }
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login correcto.',
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (err) {
    console.error('Error en login:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      where: err.where,
    });
    
    // Manejar errores de BD específicos
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Base de datos no disponible. Intente más tarde.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
    
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        error: 'Servicio no disponible. Base de datos no configurada.',
        code: 'NO_DATABASE'
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    // Manejar errores de BD específicos
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Base de datos no disponible. Intente más tarde.',
        code: 'DATABASE_UNAVAILABLE'
      });
    }
    next(err);
  }
};

module.exports = {
  register,
  login,
  me,
};
