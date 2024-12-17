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

// Consultar Producción por Rango de Fechas
const consultarProduccionPorRango = (req, res) => {
  const { inicio, fin } = req.query;

  if (!inicio || !fin) {
    return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin.' });
  }

  try {
    const stmt = db.prepare(`
      SELECT p.nombre AS producto, pr.cantidad, pr.fecha
      FROM produccion pr
      JOIN productos p ON p.id = pr.producto_id
      WHERE DATE(pr.fecha) BETWEEN ? AND ?
    `);
    const rows = stmt.all(inicio, fin);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar la producción por rango de fechas: ' + err.message });
  }
};

// Consultar Producción por Usuario y Rango de Fechas
const consultarProduccionPorUsuarioYFechas = (req, res) => {
  const { usuario_id } = req.params;
  const { inicio, fin } = req.query;

  if (!inicio || !fin) {
    return res.status(400).json({ error: 'Debe proporcionar las fechas de inicio y fin.' });
  }

  try {
    const stmt = db.prepare(`
      SELECT p.nombre AS producto, pr.cantidad, pr.fecha
      FROM produccion pr
      JOIN productos p ON p.id = pr.producto_id
      WHERE pr.usuario_id = ? AND DATE(pr.fecha) BETWEEN ? AND ?
    `);
    const rows = stmt.all(usuario_id, inicio, fin);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al consultar producción por usuario y rango de fechas:', err.message);
    res.status(500).json({ error: 'Error al consultar la producción.' });
  }
};

// Consultar Producción por Producto
const consultarProduccionPorProducto = (req, res) => {
  const { producto_id } = req.params;

  try {
    const stmt = db.prepare(`
      SELECT u.usuario AS empleado, pr.cantidad, pr.fecha
      FROM produccion pr
      JOIN usuarios u ON u.id = pr.usuario_id
      WHERE pr.producto_id = ?
    `);
    const rows = stmt.all(producto_id);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al consultar producción por producto:', err.message);
    res.status(500).json({ error: 'Error al consultar la producción por producto.' });
  }
};

// Eliminar Producción
const eliminarProduccion = (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el registro existe
    const produccion = db.prepare('SELECT * FROM produccion WHERE id = ?').get(id);
    if (!produccion) {
      return res.status(404).json({ error: 'Registro de producción no encontrado.' });
    }

    // Restar la cantidad del stock del producto
    const actualizarStock = db.prepare(`
      UPDATE productos SET stock = stock - ? WHERE id = ?
    `);
    actualizarStock.run(produccion.cantidad, produccion.producto_id);

    // Eliminar la producción
    const eliminar = db.prepare('DELETE FROM produccion WHERE id = ?');
    eliminar.run(id);

    res.status(200).json({ mensaje: 'Producción eliminada correctamente.' });
  } catch (err) {
    console.error('Error al eliminar producción:', err.message);
    res.status(500).json({ error: 'Error al eliminar producción.' });
  }
};

// Actualizar Producción
const actualizarProduccion = (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    // Verificar si el registro existe
    const produccion = db.prepare('SELECT * FROM produccion WHERE id = ?').get(id);
    if (!produccion) {
      return res.status(404).json({ error: 'Registro de producción no encontrado.' });
    }

    // Calcular la diferencia de stock
    const diferencia = cantidad - produccion.cantidad;

    // Actualizar el stock del producto
    const actualizarStock = db.prepare(`
      UPDATE productos SET stock = stock + ? WHERE id = ?
    `);
    actualizarStock.run(diferencia, produccion.producto_id);

    // Actualizar la cantidad en la producción
    const actualizar = db.prepare(`
      UPDATE produccion SET cantidad = ? WHERE id = ?
    `);
    actualizar.run(cantidad, id);

    res.status(200).json({ mensaje: 'Producción actualizada correctamente.' });
  } catch (err) {
    console.error('Error al actualizar producción:', err.message);
    res.status(500).json({ error: 'Error al actualizar producción.' });
  }
};

// Exportar todas las funciones
module.exports = { 
  registrarProduccion, 
  consultarProduccion, 
  consultarProduccionPorRango, 
  consultarProduccionPorUsuarioYFechas,
  consultarProduccionPorProducto,
  eliminarProduccion,
  actualizarProduccion
};
