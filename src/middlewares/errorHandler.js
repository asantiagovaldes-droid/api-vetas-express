export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  const response = {
    status: 'error',
    message: err.message || 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    response.details = err.stack;
  }

  return res.status(statusCode).json(response);
};
