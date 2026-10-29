export const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const jsonValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    data: null,
    timestamp: new Date().toISOString(),
    message
  });
};

export const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    return jsonValidationError(res, 'El identificador debe ser un número entero positivo.');
  }

  return next();
};

export const validateQueryId = (fieldName = 'id') => (req, res, next) => {
  const value = req.query[fieldName];

  if (!value || !isPositiveInteger(value)) {
    return jsonValidationError(res, `El parámetro ${fieldName} debe ser un número entero positivo.`);
  }

  return next();
};

export const validateBodyDate = (fieldName) => (req, res, next) => {
  const value = req.body[fieldName];

  if (!value || Number.isNaN(Date.parse(value))) {
    return jsonValidationError(res, `${fieldName} debe ser una fecha válida.`);
  }

  return next();
};
