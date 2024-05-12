const mongoose = require('mongoose');

// Definir el esquema de la colección de Servicios
const ServiciosSchema = new mongoose.Schema({
    idServicio: Number,
    nombre: String,
    duracion: Number,
    precio: Number,
    descripcion: String,
    dificultad: String
});

// Crear el modelo Servicio basado en el esquema definido
const Servicio = mongoose.model('Servicios', ServiciosSchema);

module.exports = Servicio;
