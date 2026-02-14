/**
 * Controlador de productos (álbumes). Listar, ver por código, crear (solo admin).
 */

const Product = require('../models/Product');

const getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getByCode = async (req, res, next) => {
  try {
    const { codigo } = req.params;
    const product = await Product.findByCode(codigo);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const {
      nombre, codigo, precio, descripcion,
      artista, imagen, genero, anio, num_canciones, info_relevante,
    } = req.body;
    const existing = await Product.findByCode(codigo);
    if (existing) {
      return res.status(400).json({ error: 'El código de producto ya existe.' });
    }
    const product = await Product.create({
      nombre, codigo, precio, descripcion,
      artista, imagen, genero, anio, num_canciones, info_relevante,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getByCode,
  create,
};
