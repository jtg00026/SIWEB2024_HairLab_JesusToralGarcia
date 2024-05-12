const mongoose = require('mongoose');

// Definir el esquema de la colección de Productos
const ProductosSchema = new mongoose.Schema({
    idProducto: Number,
    nombre: String,
    categoria: String,
    descripcion: String,
    precio: Number
});

// Crear el modelo Producto basado en el esquema definido
const Producto = mongoose.model('Productos', ProductosSchema);

module.exports = Producto;
