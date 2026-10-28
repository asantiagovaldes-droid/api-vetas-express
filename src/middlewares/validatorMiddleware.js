export const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

export const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'El identificador debe ser un número entero positivo.'
    });
  }

  return next();
};

export const validateQueryId = (fieldName = 'id') => (req, res, next) => {
  const value = req.query[fieldName];

  if (!value || !isPositiveInteger(value)) {
    return res.status(400).json({
      status: 'fail',
      message: `El parámetro ${fieldName} debe ser un número entero positivo.`
    });
  }

  return next();
};

export const validateBodyDate = (fieldName) => (req, res, next) => {
  const value = req.body[fieldName];

  if (!value || Number.isNaN(Date.parse(value))) {
    return res.status(400).json({
      status: 'fail',
      message: `${fieldName} debe ser una fecha válida.`
    });
  }

  return next();
};
