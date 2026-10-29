export const healthController = (req, res) => {
  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    message: 'API funcionando correctamente.',
    data: {
      uptime: Number(process.uptime().toFixed(2))
    }
  });
};
