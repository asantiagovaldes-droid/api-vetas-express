import { pool } from '../config/db.js';

export const getConsolidadoVentas = async (req, res, next) => {
  try {
    const { sucursal, anio } = req.query;

    if (!sucursal || !anio) {
      return res.status(400).json({
        status: 'fail',
        message: 'Debe enviar los parámetros sucursal y anio.'
      });
    }

    const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal, anio]);

    return res.status(200).json({
      status: 'success',
      total_registros: rows[0] ? rows[0].length : 0,
      data: rows[0] || []
    });
  } catch (error) {
    return next(error);
  }
};

export const getVentaById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [result] = await pool.query('CALL sp_venta_id(?)', [id]);
    const venta = result[0];

    if (!venta || venta.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `No se encontró la venta con el id ${id}.`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: venta[0]
    });
  } catch (error) {
    return next(error);
  }
};

export const getDetalleVenta = async (req, res, next) => {
  try {
    const { id_venta } = req.query;
    const ventaId = Number(id_venta);

    if (!id_venta || !Number.isInteger(ventaId) || ventaId <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Debe enviar un id_venta válido.'
      });
    }

    const [rows] = await pool.query(
      `SELECT v.fecha_venta,
              c.nombre AS nombre_cliente,
              c.ciudad AS ciudad_cliente,
              p.nombre AS producto,
              v.cantidad,
              (v.cantidad * p.precio) AS monto_venta
       FROM ventas v
       INNER JOIN clientes c ON c.id_cliente = v.id_cliente
       INNER JOIN productos p ON p.id_producto = v.id_producto
       WHERE v.id_venta = ?`,
      [ventaId]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró una venta con ese id_venta.'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    return next(error);
  }
};

export const createVenta = async (req, res, next) => {
  try {
    const { id_producto, id_cliente, cantidad, fecha_venta } = req.body;

    if (!id_producto || !id_cliente || !cantidad || !fecha_venta) {
      return res.status(400).json({
        status: 'fail',
        message: 'Todos los parámetros obligatorios deben enviarse: id_producto, id_cliente, cantidad y fecha_venta.'
      });
    }

    if (!Number.isInteger(Number(id_producto)) || Number(id_producto) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'id_producto debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(id_cliente)) || Number(id_cliente) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'id_cliente debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'cantidad debe ser un entero positivo.'
      });
    }

    if (Number.isNaN(Date.parse(fecha_venta))) {
      return res.status(400).json({
        status: 'fail',
        message: 'fecha_venta debe ser una fecha válida.'
      });
    }

    await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [
      id_producto,
      id_cliente,
      cantidad,
      fecha_venta
    ]);

    return res.status(201).json({
      status: 'success',
      message: 'Venta registrada correctamente.',
      data: {
        id_producto,
        id_cliente,
        cantidad,
        fecha_venta
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateVenta = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { cantidad, fecha_venta } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'El id debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'cantidad debe ser un entero positivo.'
      });
    }

    if (!fecha_venta || Number.isNaN(Date.parse(fecha_venta))) {
      return res.status(400).json({
        status: 'fail',
        message: 'fecha_venta debe ser una fecha válida.'
      });
    }

    const [exist] = await pool.query('SELECT id_venta FROM ventas WHERE id_venta = ?', [id]);
    if (!exist.length) {
      return res.status(404).json({
        status: 'fail',
        message: `No existe una venta con el id ${id}.`
      });
    }

    await pool.query('UPDATE ventas SET cantidad = ?, fecha_venta = ? WHERE id_venta = ?', [cantidad, fecha_venta, id]);

    return res.status(200).json({
      status: 'success',
      message: 'Venta actualizada correctamente.'
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteVenta = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const [exist] = await pool.query('SELECT id_venta FROM ventas WHERE id_venta = ?', [id]);
    if (!exist.length) {
      return res.status(404).json({
        status: 'fail',
        message: `No existe una venta con el id ${id}.`
      });
    }

    await pool.query('DELETE FROM ventas WHERE id_venta = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: 'Venta eliminada correctamente.'
    });
  } catch (error) {
    return next(error);
  }
};
