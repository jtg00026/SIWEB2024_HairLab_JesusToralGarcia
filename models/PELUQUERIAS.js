const mongoose = require('mongoose');

// Definir el esquema de la colección de Peluquerías
const PeluqueriasSchema = new mongoose.Schema({
    idPeluqueria: Number,
    cif: String,
    nombreNegocio: String,
    direccion: String,
    localidad: {
        codPostal: String,
        nombre: String,
        pais: String
    },
    servicios: [{
        idServicio: Number,
        nombre: String,
        duracion: Number,
        precio: Number,
        descripcion: String,
        dificultad: String
    }]
});

// Crear el modelo Peluqueria basado en el esquema definido
const Peluquerias = mongoose.model('peluquerias', PeluqueriasSchema);

module.exports = Peluquerias;
