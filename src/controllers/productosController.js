import { pool } from '../config/db.js';

export const getProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query('CALL sp_listar_productos()');
    const data = Array.isArray(rows[0]) ? rows[0] : [];

    return res.status(200).json({
      status: 'success',
      total_registros: data.length,
      data
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
      return res.status(404).json({
        status: 'fail',
        message: `No existe un producto con el id ${id}.`
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

export const createProducto = async (req, res, next) => {
  try {
    const { id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo } = req.body;

    if (!id_categoria || !nombre_producto || !precio_unitario || !costo_proveedor) {
      return res.status(400).json({
        status: 'fail',
        message: 'Faltan campos obligatorios: id_categoria, nombre_producto, precio_unitario y costo_proveedor.'
      });
    }

    if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'id_categoria debe ser un entero positivo.'
      });
    }

    const nombre = String(nombre_producto).trim();
    if (nombre.length < 3) {
      return res.status(400).json({
        status: 'fail',
        message: 'nombre_producto debe tener al menos 3 caracteres.'
      });
    }

    const precio = Number(precio_unitario);
    const costo = Number(costo_proveedor);

    if (!Number.isFinite(precio) || precio <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'precio_unitario debe ser un número válido y positivo.'
      });
    }

    if (!Number.isFinite(costo) || costo <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'costo_proveedor debe ser un número válido y positivo.'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO productos (id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo) VALUES (?, ?, ?, ?, ?)',
      [id_categoria, nombre, precio, costo, ubicacion_pasillo || null]
    );

    return res.status(201).json({
      status: 'success',
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
      return res.status(400).json({
        status: 'fail',
        message: 'El id debe ser un entero positivo.'
      });
    }

    const [exist] = await pool.query('SELECT id_producto FROM productos WHERE id_producto = ?', [id]);
    if (!exist.length) {
      return res.status(404).json({
        status: 'fail',
        message: `No existe un producto con el id ${id}.`
      });
    }

    const nombre = String(nombre_producto || '').trim();
    if (!nombre || nombre.length < 3) {
      return res.status(400).json({
        status: 'fail',
        message: 'nombre_producto debe tener al menos 3 caracteres.'
      });
    }

    const precio = Number(precio_unitario);
    const costo = Number(costo_proveedor);

    if (!Number.isFinite(precio) || precio <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'precio_unitario debe ser un número válido y positivo.'
      });
    }

    if (!Number.isFinite(costo) || costo <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'costo_proveedor debe ser un número válido y positivo.'
      });
    }

    await pool.query(
      'UPDATE productos SET id_categoria = ?, nombre_producto = ?, precio_unitario = ?, costo_proveedor = ?, ubicacion_pasillo = ? WHERE id_producto = ?',
      [id_categoria, nombre, precio, costo, ubicacion_pasillo || null, id]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Producto actualizado correctamente.'
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
      return res.status(404).json({
        status: 'fail',
        message: `No existe un producto con el id ${id}.`
      });
    }

    await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);

    return res.status(200).json({
      status: 'success',
      message: 'Producto eliminado correctamente.'
    });
  } catch (error) {
    return next(error);
  }
};
