export const healthController = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente.',
    uptime: process.uptime()
  });
};
