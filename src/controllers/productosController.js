const db = require('../../config/database');

// Registrar Producto
const registrarProducto = (req, res) => {
  const { nombre, descripcion, stock } = req.body;

  try {
    // Verificar si el producto ya existe
    const stmtVerificar = db.prepare('SELECT * FROM productos WHERE nombre = ?');
    const existeProducto = stmtVerificar.get(nombre);

    if (existeProducto) {
      return res.status(400).json({ 
        mensaje: 'El producto ya existe. Intenta con otro nombre.' 
      });
    }

    // Insertar el producto si no existe
    const stmtInsertar = db.prepare('INSERT INTO productos (nombre, descripcion, stock) VALUES (?, ?, ?)');
    const result = stmtInsertar.run(nombre, descripcion, stock || 0);

    res.status(201).json({ 
      mensaje: 'Producto registrado correctamente', 
      producto_id: result.lastInsertRowid 
    });
  } catch (err) {
    console.error('Error al registrar producto:', err.message);
    res.status(500).json({ 
      mensaje: 'Error al registrar producto: ' + err.message 
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
      mensaje: 'Error al consultar productos: ' + err.message 
    });
  }
};

module.exports = { registrarProducto, consultarProductos };
