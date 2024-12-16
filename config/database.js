const Database = require('better-sqlite3');
const path = require('path');

// Ruta absoluta al archivo de la base de datos
const dbPath = path.resolve(__dirname, '../app_negocio.db');

// Conectar a la base de datos
const db = new Database(dbPath, { verbose: console.log });

// Consultar tablas existentes
const tablas = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
console.log("Tablas existentes:", tablas);

console.log('Conexión exitosa a la base de datos SQLite usando better-sqlite3');

// Crear tablas si no existen
db.prepare(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS actividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    tipo TEXT NOT NULL,
    descripcion TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS produccion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    producto_id INTEGER,
    cantidad INTEGER NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
    FOREIGN KEY (producto_id) REFERENCES productos (id)
  )
`).run();

// Crear tabla de productos
db.prepare(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,
    stock INTEGER DEFAULT 0
  )
`).run();


module.exports = db;
