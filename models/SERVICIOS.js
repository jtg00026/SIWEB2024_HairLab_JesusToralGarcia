const mongoose = require('mongoose');

// Definir el esquema de la colección de Servicios
const ServiciosSchema = new mongoose.Schema({
    idServicio: Number,
    nombre: String,
    duracion: Number,
    precio: Number,
    categoria: String,
    subcategoria: String,
    descripcion: String,
    dificultad: String,
    enlaceImagen: String,

    masinfo: {
        procedimiento: [{
            paso: Number,
            descripcion: String
        }],
        herramientas: [{
            idProducto: Number,
            nombre: String,
            categoria: String,
            subcategoria: String,
            descripcion: String,
            precio: Number,
            imagen: String
        }],
        productos: [{
            idProducto: Number,
            nombre: String,
            categoria: String,
            subcategoria: String,
            descripcion: String,
            precio: Number,
            imagen: String
        }], 
        cuidadosPosteriores: [String],
        imagenesAdicionales: [String]
    }
});

// Crear el modelo Servicio basado en el esquema definido
const Servicio = mongoose.model('Servicios', ServiciosSchema);

module.exports = Servicio;
