import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let rows = [];

    try {
      const [result] = await pool.query('CALL sp_listar_productos()');
      rows = Array.isArray(result[0]) ? result[0] : [];
    } catch (error) {
      const [result] = await pool.query(`
        SELECT
          p.id_producto,
          p.id_categoria,
          p.nombre_producto,
          p.precio_unitario,
          p.costo_proveedor,
          p.ubicacion_pasillo
        FROM productos p
        ORDER BY p.id_producto ASC
      `);
      rows = result;
    }

    return res.status(200).json({
      status: 'success',
      total_registros: rows.length,
      data: rows
    });
  } catch (error) {
    console.log('Error en GET /api/v1/productos:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al consultar productos'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      id_categoria,
      nombre_producto,
      precio_unitario,
      costo_proveedor,
      ubicacion_pasillo
    } = req.body;

    if (!id_categoria || !nombre_producto || !precio_unitario || !costo_proveedor) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Faltan campos obligatorios: id_categoria, nombre_producto, precio_unitario y costo_proveedor'
      });
    }

    const nombre = String(nombre_producto).trim();
    if (nombre.length < 3) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El nombre del producto debe tener al menos 3 caracteres'
      });
    }

    const precio = Number(precio_unitario);
    const costo = Number(costo_proveedor);

    if (!Number.isFinite(precio) || !Number.isFinite(costo) || precio <= 0 || costo <= 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'precio_unitario y costo_proveedor deben ser valores numéricos válidos'
      });
    }

    let respuesta;

    try {
      const [result] = await pool.query('CALL sp_registrar_producto(?, ?, ?, ?, ?)', [
        id_categoria,
        nombre,
        precio,
        costo,
        ubicacion_pasillo || null
      ]);
      respuesta = Array.isArray(result[0]) ? result[0][0] : result[0];
    } catch (error) {
      const [result] = await pool.query(
        `INSERT INTO productos (id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo)
         VALUES (?, ?, ?, ?, ?)`,
        [
          id_categoria,
          nombre,
          precio,
          costo,
          ubicacion_pasillo || null
        ]
      );

      respuesta = {
        id_producto: result.insertId,
        mensaje: 'Producto registrado'
      };
    }

    return res.status(201).json({
      status: 'created',
      message: 'Producto registrado correctamente',
      data: respuesta
    });
  } catch (error) {
    console.log('Error en POST /api/v1/productos:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al registrar producto'
    });
  }
});

export default router;
