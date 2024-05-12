const mongoose = require('mongoose');

// Definir el esquema de la colección de Usuarios
const UsuarioSchema = new mongoose.Schema({
    dni: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    email: String,
    telefono: String,
    fechaNacimiento: Date,
    tipoUsuario: String,
    localidad: {
        codPostal: String,
        nombre: String,
        pais: String
    },
    reservas: [{
        idReserva: Number,
        fecha: Date,
        hora: String,
        estado: String,
        peluqueria: {
            idPeluqueria: Number,
            cif: String,
            nombreNegocio: String,
            direccion: String,
            localidad: {
                codPostal: String,
                nombre: String,
                pais: String
            }
        },
        servicio: {
            idServicio: Number,
            nombre: String,
            duracion: Number,
            precio: Number,
            descripcion: String,
            dificultad: String
        }
    }],
    ventas: [{
        idVenta: Number,
        fecha: Date,
        total: Number,
        estado: String,
        productos: {
            idProducto: Number,
            nombre: String,
            categoria: String,
            descripcion: String,
            precio: Number
        }
    }]
});

// Crear el modelo Usuario basado en el esquema definido
const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
