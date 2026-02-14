/**
 * Manejo de errores centralizado.
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err?.message,
    code: err?.code,
    statusCode: err?.statusCode,
    stack: err?.stack,
  });
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
