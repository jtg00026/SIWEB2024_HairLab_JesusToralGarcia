const mongoose = require('mongoose');

// Definir el esquema de la colección de Usuarios
const UsuarioSchema = new mongoose.Schema({
    dni: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    email: String,
    contrasena: String, // Almacenar la contraseña sin cifrar
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

// Método para validar la contraseña
UsuarioSchema.methods.validarContrasena = function(contraseña) {
    // Comparar la contraseña proporcionada con la contraseña almacenada en el modelo de usuario
    return contraseña === this.contrasena;
};

// Crear el modelo Usuario basado en el esquema definido
const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
