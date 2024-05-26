const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const usuarios = require('./models/usuarios');
const peluquerias = require('./models/peluquerias');
const servicios = require('./models/servicios');
const productos = require('./models/productos');

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

        if (usuario.contrasena !== password) {
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

        // Guardar el nuevo usuario en la base de datos
        await usuarios.create(userData);

        console.log('Usuario registrado correctamente en la base de datos.');
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.post('/iniciarSesion', (req, res, next) => {
    console.log('Solicitud de inicio de sesión recibida:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return next(err);
        }
        if (!user) {
            console.log('Usuario no encontrado o contraseña incorrecta');
            return res.status(401).json({ success: false, message: 'Inicio de sesión fallido' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error en req.logIn:', err);
                return next(err);
            }
            console.log('Usuario autenticado con éxito:', user);
            return res.json({ success: true });
        });
    })(req, res, next);
});

// Ruta para manejar las solicitudes GET para obtener los servicios
app.get('/obtenerServicios', async (req, res) => {
    try {
        // Obtener todos los servicios de la base de datos
        const serviciosObtenidos = await servicios.find();
        console.log("Servicios encontrados:", serviciosObtenidos);
        res.json(serviciosObtenidos);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para manejar las solicitudes GET para obtener un servicio por su ID
app.get('/obtenerServicio', async (req, res) => {
    try {
        const servicioId = req.query.id;
        // Buscar el servicio por su idServicio en lugar de _id
        const servicio = await servicios.findOne({ idServicio: servicioId });
        if (!servicio) {
            // Si no se encuentra el servicio, enviar un mensaje de error
            return res.status(404).send('Servicio no encontrado');
        }
        // Si se encuentra el servicio, enviarlo como respuesta
        res.json(servicio);
    } catch (error) {
        console.error('Error al obtener el servicio:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para manejar las solicitudes GET para obtener los productos
app.get('/obtenerProductos', async (req, res) => {
    try {
        // Obtener todos los productos de la base de datos
        const productosObtenidos = await productos.find();
        console.log("Productos encontrados:", productosObtenidos);
        res.json(productosObtenidos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para manejar la página mas-info.html
app.get('/mas-info.html', (req, res) => {
    // Ruta del archivo HTML solicitado
    const filePath = path.join(__dirname, 'public', 'mas-info.html');

    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // El archivo no existe, redirigir a 404.html
            res.sendFile(path.join(__dirname, 'public', '404.html'));
        } else {
            // El archivo existe, enviarlo como respuesta
            res.sendFile(filePath);
        }
    });
});

// Ruta para manejar cualquier solicitud de archivo HTML con parámetros
app.get('/:pagina', (req, res) => {
    // Obtener el nombre de la página solicitada
    const pagina = req.params.pagina;
    
    // Ruta del archivo HTML solicitado
    const filePath = path.join(__dirname, 'public', `${pagina}.html`);
    
    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // El archivo no existe, redirigir a 404.html
            res.sendFile(path.join(__dirname, 'public', '404.html'));
        } else {
            // El archivo existe, enviarlo como respuesta
            res.sendFile(filePath);
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express: Está escuchando en el puerto ${PORT}`);
});

module.exports = app;
