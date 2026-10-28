DROP PROCEDURE IF EXISTS sp_listar_productos;
DROP PROCEDURE IF EXISTS sp_registrar_producto;

CREATE PROCEDURE sp_listar_productos()
BEGIN
    SELECT
        p.id_producto,
        p.id_categoria,
        p.nombre_producto,
        p.precio_unitario,
        p.costo_proveedor,
        p.ubicacion_pasillo
    FROM productos p
    ORDER BY p.id_producto ASC;
END;

CREATE PROCEDURE sp_registrar_producto(
    IN prmIdCategoria INT,
    IN prmNombreProducto VARCHAR(100),
    IN prmPrecioUnitario INT,
    IN prmCostoProveedor INT,
    IN prmUbicacionPasillo VARCHAR(10)
)
BEGIN
    INSERT INTO productos (
        id_categoria,
        nombre_producto,
        precio_unitario,
        costo_proveedor,
        ubicacion_pasillo
    ) VALUES (
        prmIdCategoria,
        prmNombreProducto,
        prmPrecioUnitario,
        prmCostoProveedor,
        prmUbicacionPasillo
    );

    SELECT LAST_INSERT_ID() AS id_producto, 'Producto registrado' AS mensaje;
END;



SHOW TABLES;
DESCRIBE productos;
DESCRIBE ventas;
SELECT * FROM clientes LIMIT 5;
SELECT * FROM productos LIMIT 5;
SELECT * FROM ventas LIMIT 5;