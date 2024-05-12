const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const usuarios = require('./models/usuarios');

const uri = "mongodb://admin:admin@localhost:27017/bdd?authSource=admin";

mongoose.connect(uri, {})
    .then(() => console.log('Se ha conectado a MongoDB satisfactoriamente.'))
    .catch((e) => console.log("Se ha producido un error: " + e))

const app = express();
const PORT = 3001; // Cambiado el puerto a 3001

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analizar los datos del cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'miClaveSecreta', // Cambia esto por una cadena de texto segura
    resave: false,
    saveUninitialized: false
}));

// Inicializa Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuración de la estrategia local para Passport.js
passport.use(new LocalStrategy({
    usernameField: 'email', // Campo del formulario para el email
    passwordField: 'password' // Campo del formulario para la contraseña
}, async (email, password, done) => {
    try {
        const usuario = await usuarios.findOne({ email });

        if (!usuario) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        const contraseñaValida = await bcrypt.compare(password, usuario.contrasena);

        if (!contraseñaValida) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, usuario);
    } catch (error) {
        return done(error);
    }
}));

// Serialización y deserialización de usuarios para Passport.js
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await usuarios.findById(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

// Ruta para manejar el registro de usuarios
app.post('/registrarUsuario', async (req, res) => {
    try {
        const userData = req.body; // Datos del usuario enviados desde el formulario
        console.log('Datos del usuario recibidos:', userData);

        // Crear una instancia del modelo de Usuario con los datos recibidos
        const nuevoUsuario = new usuarios(userData);

        // Generar el hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userData.contrasena, salt);
        nuevoUsuario.contrasena = hash;

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        console.log('Usuario registrado correctamente en la base de datos.');
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para manejar la autenticación de usuarios (inicio de sesión)
app.post('/iniciarSesion', passport.authenticate('local', {
    successRedirect: '/inicioCorrecto',
    failureRedirect: '/inicioIncorrecto',
    failureFlash: true
}));

// Ruta para manejar el inicio de sesión correcto
app.get('/inicioCorrecto', (req, res) => {
    res.json({ success: true, message: 'Inicio de sesión exitoso' });
});

// Ruta para manejar el inicio de sesión incorrecto
app.get('/inicioIncorrecto', (req, res) => {
    res.status(401).json({ success: false, message: 'Inicio de sesión fallido' });
});

// Ruta para manejar las solicitudes GET para obtener los servicios
app.get('/obtenerServicios', async (req, res) => {
    try {
        // Obtener todos los servicios de la base de datos
        const serviciosObtenidos = await Servicio.find();
        console.log("Servicios encontrados:", serviciosObtenidos);
        res.json(serviciosObtenidos);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Manejo de método no permitido.
app.use((req, res) => {
    res.status(405).send('Método no permitido.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express: Está escuchando en el puerto ${PORT}`);
});

module.exports = app;
