import { pool } from '../config/db.js';

const apiResponse = (res, statusCode, payload = {}) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    timestamp: new Date().toISOString(),
    ...payload
  });
};

export const getProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_productos()');
    const data = Array.isArray(rows[0]) ? rows[0] : [];

    return apiResponse(res, 200, {
      message: 'Productos obtenidos correctamente.',
      data,
      total_registros: data.length
    });
  } catch (error) {
    return next(error);
  }
};

export const getProductoById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);

    if (!rows.length) {
      return apiResponse(res, 404, {
        data: null,
        message: `No existe un producto con el id ${id}.`
      });
    }

    return apiResponse(res, 200, {
      message: 'Producto encontrado.',
      data: rows[0]
    });
  } catch (error) {
    return next(error);
  }
};

export const createProducto = async (req, res, next) => {
  try {
    const { id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo } = req.body;

    if (!id_categoria || !nombre_producto || !precio_unitario || !costo_proveedor) {
      return apiResponse(res, 400, {
        data: null,
        message: 'Faltan campos obligatorios: id_categoria, nombre_producto, precio_unitario y costo_proveedor.'
      });
    }

    if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'id_categoria debe ser un entero positivo.'
      });
    }

    const nombre = String(nombre_producto).trim();
    if (nombre.length < 3) {
      return apiResponse(res, 400, {
        data: null,
        message: 'nombre_producto debe tener al menos 3 caracteres.'
      });
    }

    const precio = Number(precio_unitario);
    const costo = Number(costo_proveedor);

    if (!Number.isFinite(precio) || precio <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'precio_unitario debe ser un número válido y positivo.'
      });
    }

    if (!Number.isFinite(costo) || costo <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'costo_proveedor debe ser un número válido y positivo.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO productos (id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo) VALUES (?, ?, ?, ?, ?)',
      [id_categoria, nombre, precio, costo, ubicacion_pasillo || null]
    );

    return apiResponse(res, 201, {
      message: 'Producto registrado correctamente.',
      data: {
        id_producto: result.insertId
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProducto = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'El id debe ser un entero positivo.'
      });
    }

    const [exist] = await pool.query('SELECT id_producto FROM productos WHERE id_producto = ?', [id]);
    if (!exist.length) {
      return apiResponse(res, 404, {
        data: null,
        message: `No existe un producto con el id ${id}.`
      });
    }

    const nombre = String(nombre_producto || '').trim();
    if (!nombre || nombre.length < 3) {
      return apiResponse(res, 400, {
        data: null,
        message: 'nombre_producto debe tener al menos 3 caracteres.'
      });
    }

    const precio = Number(precio_unitario);
    const costo = Number(costo_proveedor);

    if (!Number.isFinite(precio) || precio <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'precio_unitario debe ser un número válido y positivo.'
      });
    }

    if (!Number.isFinite(costo) || costo <= 0) {
      return apiResponse(res, 400, {
        data: null,
        message: 'costo_proveedor debe ser un número válido y positivo.'
      });
    }

    await pool.query(
      'UPDATE productos SET id_categoria = ?, nombre_producto = ?, precio_unitario = ?, costo_proveedor = ?, ubicacion_pasillo = ? WHERE id_producto = ?',
      [id_categoria, nombre, precio, costo, ubicacion_pasillo || null, id]
    );

    return apiResponse(res, 200, {
      message: 'Producto actualizado correctamente.',
      data: { id_producto: id }
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProducto = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const [exist] = await pool.query('SELECT id_producto FROM productos WHERE id_producto = ?', [id]);
    if (!exist.length) {
      return apiResponse(res, 404, {
        data: null,
        message: `No existe un producto con el id ${id}.`
      });
    }

    await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);

    return apiResponse(res, 200, {
      message: 'Producto eliminado correctamente.',
      data: { id_producto: id }
    });
  } catch (error) {
    return next(error);
  }
};
