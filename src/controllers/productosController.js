const db = require('../../config/database');

// Registrar Producto
const registrarProducto = (req, res) => {
  const { nombre, descripcion, stock } = req.body;

  try {
    const stmtVerificar = db.prepare('SELECT * FROM productos WHERE nombre = ?');
    const existeProducto = stmtVerificar.get(nombre);

    if (existeProducto) {
      return res.status(400).json({
        mensaje: 'El producto ya existe. Intenta con otro nombre.',
      });
    }

    const stmtInsertar = db.prepare('INSERT INTO productos (nombre, descripcion, stock) VALUES (?, ?, ?)');
    const result = stmtInsertar.run(nombre, descripcion, stock || 0);

    res.status(201).json({
      mensaje: 'Producto registrado correctamente',
      producto_id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error('Error al registrar producto:', err.message);
    res.status(500).json({
      mensaje: 'Error al registrar producto: ' + err.message,
    });
  }
};

// Consultar Productos
const consultarProductos = (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM productos');
    const rows = stmt.all();

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al consultar productos:', err.message);
    res.status(500).json({
      mensaje: 'Error al consultar productos: ' + err.message,
    });
  }
};

// Consultar Stock Total
const consultarStock = (req, res) => {
  try {
    const stmt = db.prepare('SELECT nombre, descripcion, stock FROM productos');
    const productos = stmt.all();

    res.status(200).json(productos);
  } catch (err) {
    console.error('Error al consultar stock total:', err.message);
    res.status(500).json({
      mensaje: 'Error al consultar stock total: ' + err.message,
    });
  }
};

// Actualizar Producto
const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, stock } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE productos
      SET nombre = COALESCE(?, nombre),
          descripcion = COALESCE(?, descripcion),
          stock = COALESCE(?, stock)
      WHERE id = ?
    `);

    const result = stmt.run(nombre, descripcion, stock, id);

    if (result.changes === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Producto actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar producto:', err.message);
    res.status(500).json({
      mensaje: 'Error al actualizar producto: ' + err.message,
    });
  }
};

// Eliminar Producto
const eliminarProducto = (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM productos WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producto:', err.message);
    res.status(500).json({
      mensaje: 'Error al eliminar producto: ' + err.message,
    });
  }
};

// Exportar todas las funciones
module.exports = {
  registrarProducto,
  consultarProductos,
  consultarStock,
  actualizarProducto,
  eliminarProducto,
};
