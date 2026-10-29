export const errorHandler = (err, req, res, next) => {
  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : Number.isInteger(err.status)
      ? err.status
      : 500;

  const response = {
    success: false,
    data: null,
    timestamp: new Date().toISOString(),
    message: err.message || 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    response.details = err.stack;
  }

  return res.status(statusCode).json(response);
};
