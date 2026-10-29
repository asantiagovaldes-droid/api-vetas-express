import { pool } from '../config/db.js';

const apiResponse = (res, statusCode, payload = {}) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    timestamp: new Date().toISOString(),
    ...payload
  });
};

export const getConsolidadoVentas = async (req, res, next) => {
  try {
    const { sucursal, anio } = req.query;

    if (!sucursal || !anio) {
      return apiResponse(res, 400, {
        data: null,
        message: 'Debe enviar los parámetros sucursal y anio.'
      });
    }

    const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal, anio]);
    const data = Array.isArray(rows[0]) ? rows[0] : [];

    return apiResponse(res, 200, {
      message: 'Consolidado de ventas obtenido correctamente.',
      data,
      total_registros: data.length
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
      return apiResponse(res, 404, {
        data: null,
        message: `No se encontró la venta con el id ${id}.`
      });
    }

    return apiResponse(res, 200, {
      message: 'Venta encontrada.',
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
      return apiResponse(res, 400, {
        data: null,
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
      return apiResponse(res, 404, {
        data: null,
        message: 'No se encontró una venta con ese id_venta.'
      });
    }

    return apiResponse(res, 200, {
      message: 'Detalle de venta obtenido correctamente.',
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
      return apiResponse(res, 400, {
        data: null,
        message: 'Todos los parámetros obligatorios deben enviarse: id_producto, id_cliente, cantidad y fecha_venta.'
      });
    }

    if (!Number.isInteger(Number(id_producto)) || Number(id_producto) <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'id_producto debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(id_cliente)) || Number(id_cliente) <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'id_cliente debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'cantidad debe ser un entero positivo.'
      });
    }

    if (Number.isNaN(Date.parse(fecha_venta))) {
      return apiResponse(res, 400, {
        data: null,
        message: 'fecha_venta debe ser una fecha válida.'
      });
    }

    await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [
      id_producto,
      id_cliente,
      cantidad,
      fecha_venta
    ]);

    return apiResponse(res, 201, {
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
      return apiResponse(res, 400, {
        data: null,
        message: 'El id debe ser un entero positivo.'
      });
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'cantidad debe ser un entero positivo.'
      });
    }

    if (!fecha_venta || Number.isNaN(Date.parse(fecha_venta))) {
      return apiResponse(res, 400, {
        data: null,
        message: 'fecha_venta debe ser una fecha válida.'
      });
    }

    const [exist] = await pool.query('SELECT id_venta FROM ventas WHERE id_venta = ?', [id]);
    if (!exist.length) {
      return apiResponse(res, 404, {
        data: null,
        message: `No existe una venta con el id ${id}.`
      });
    }

    await pool.query('UPDATE ventas SET cantidad = ?, fecha_venta = ? WHERE id_venta = ?', [cantidad, fecha_venta, id]);

    return apiResponse(res, 200, {
      message: 'Venta actualizada correctamente.',
      data: { id_venta: id }
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
      return apiResponse(res, 404, {
        data: null,
        message: `No existe una venta con el id ${id}.`
      });
    }

    await pool.query('DELETE FROM ventas WHERE id_venta = ?', [id]);

    return apiResponse(res, 200, {
      message: 'Venta eliminada correctamente.',
      data: { id_venta: id }
    });
  } catch (error) {
    return next(error);
  }
};
