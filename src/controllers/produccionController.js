const db = require('../../config/database');

// Registrar Producción
const registrarProduccion = (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;

  try {
    // Validar si el producto existe
    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(producto_id);
    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    // Insertar en la tabla de producción
    const insertProduccion = db.prepare(`
      INSERT INTO produccion (usuario_id, producto_id, cantidad)
      VALUES (?, ?, ?)
    `);
    insertProduccion.run(usuario_id, producto_id, cantidad);

    // Actualizar stock del producto
    const updateStock = db.prepare(`
      UPDATE productos SET stock = stock + ? WHERE id = ?
    `);
    updateStock.run(cantidad, producto_id);

    res.status(201).json({ mensaje: 'Producción registrada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la producción: ' + err.message });
  }
};

// Consultar Producción por Usuario
const consultarProduccion = (req, res) => {
  const { usuario_id } = req.params;

  try {
    const stmt = db.prepare(`
      SELECT p.nombre AS producto, pr.cantidad, pr.fecha
      FROM produccion pr
      JOIN productos p ON p.id = pr.producto_id
      WHERE pr.usuario_id = ?
    `);
    const rows = stmt.all(usuario_id);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la producción: ' + err.message });
  }
};

module.exports = { registrarProduccion, consultarProduccion };

