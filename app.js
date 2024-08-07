const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('./models/usuarios');
const Peluquerias = require('./models/peluquerias');
const Servicios = require('./models/servicios');
const Productos = require('./models/productos');

const uri = "mongodb://admin:admin@localhost:27017/bdd?authSource=admin";

mongoose.connect(uri, {})
    .then(() => console.log('Se ha conectado a MongoDB satisfactoriamente.'))
    .catch((e) => console.log("Se ha producido un error: " + e))

const app = express();
const PORT = 3001; // Cambiado el puerto a 3001

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Maneja también formularios

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
        const usuario = await Usuarios.findOne({ email });

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
        const usuario = await Usuarios.findById(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

// Ruta para manejar la formalización de la compra
app.post('/formalizarCompra', async (req, res) => {
    const { usuarioDNI, venta } = req.body;
    console.log('Formalizando compra para el usuario con DNI:', usuarioDNI);
    console.log('Detalles de la venta:', venta);

    try {
        const usuario = await Usuarios.findOne({ dni: usuarioDNI });
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const productos = venta.productos.map(producto => ({
            idProducto: producto.idProducto,
            nombre: producto.nombre,
            categoria: producto.categoria,
            descripcion: producto.descripcion,
            precio: producto.precio,
            imagen: producto.imagen
        }));

        usuario.ventas.push({
            idVenta: venta.idVenta,
            fecha: new Date(venta.fecha),
            total: venta.total,
            estado: venta.estado,
            productos: productos
        });

        await usuario.save();

        res.json({ success: true, message: 'Compra registrada con éxito' });
    } catch (error) {
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para manejar el registro de usuarios
app.post('/registrarUsuario', async (req, res) => {
    try {
        const userData = req.body; // Datos del usuario enviados desde el formulario
        console.log('Datos del usuario recibidos:', userData);

        // Guardar el nuevo usuario en la base de datos
        await Usuarios.create(userData);

        console.log('Usuario registrado correctamente en la base de datos.');
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
            return res.status(401).json({ success: false, message: 'Usuario no encontrado o contraseña incorrecta' });
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
app.get('/obtenerVentas', async (req, res) => {
    const { dni } = req.query;

    try {
        const usuario = await Usuarios.findOne({ dni: dni });
        if (!usuario) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        res.send(usuario.ventas);
    } catch (error) {
        console.error('Error al obtener las ventas del usuario:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
});

// Ruta para manejar las solicitudes GET para obtener los servicios
app.get('/obtenerServicios', async (req, res) => {
    try {
        // Obtener todos los servicios de la base de datos
        const serviciosObtenidos = await Servicios.find();
        console.log("Servicios encontrados:", serviciosObtenidos);
        res.json(serviciosObtenidos);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para manejar las solicitudes GET para obtener un servicio por su ID
app.get('/obtenerServicio', async (req, res) => {
    try {
        const servicioId = req.query.id;
        // Buscar el servicio por su idServicio en lugar de _id
        const servicio = await Servicios.findOne({ idServicio: servicioId });
        if (!servicio) {
            // Si no se encuentra el servicio, enviar un mensaje de error
            return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
        }
        // Si se encuentra el servicio, enviarlo como respuesta
        res.json(servicio);
    } catch (error) {
        console.error('Error al obtener el servicio:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para manejar las solicitudes GET para obtener los productos
app.get('/obtenerProductos', async (req, res) => {
    try {
        // Obtener todos los productos de la base de datos
        const productosObtenidos = await Productos.find();
        console.log("Productos encontrados:", productosObtenidos);
        res.json(productosObtenidos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para manejar las solicitudes GET para obtener un producto por su ID
app.get('/obtenerProducto', async (req, res) => {
    try {
        const productoId = req.query.id;
        // Buscar el producto por su idProducto en lugar de _id
        const producto = await Productos.findOne({ idProducto: productoId });
        if (!producto) {
            // Si no se encuentra el producto, enviar un mensaje de error
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        // Si se encuentra el producto, enviarlo como respuesta
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
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


app.get('/estaAutenticado', (req, res) => {
    console.log('Verificando autenticación:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.json({ autenticado: true });
    } else {
        res.json({ autenticado: false });
    }
});


app.post('/reservar', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const { fecha, hora, idServicio } = req.body;
    console.log('Datos de reserva:', { fecha, hora, idServicio });

    try {
        const usuario = await Usuarios.findById(req.user._id);
        if (!usuario) {
            return res.status(500).json({ success: false, message: 'Error al encontrar el usuario' });
        }

        const servicio = await Servicios.findOne({ idServicio });
        if (!servicio) {
            return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
        }

        const nuevaReserva = {
            idReserva: Math.floor(Math.random() * 10000),
            fecha: new Date(fecha),
            hora,
            estado: 'Pendiente',
            peluqueria: {
                idPeluqueria: 1,
                cif: "ABC",
                nombreNegocio: "peluqueriaMariTere",
                direccion: "madrededios 47",
                localidad: {
                    codPostal: "23400",
                    nombre: "Ubeda",
                    pais: "España"
                }
            },
            servicio: {
                idServicio: servicio.idServicio,
                nombre: servicio.nombre,
                duracion: servicio.duracion,
                precio: servicio.precio,
                descripcion: servicio.descripcion,
                dificultad: servicio.dificultad
            }
        };

        usuario.reservas.push(nuevaReserva);
        await usuario.save();

        res.json({ success: true, message: 'Reserva creada con éxito' });
    } catch (error) {
        console.log('Error al crear la reserva:', error);
        res.status(500).json({ success: false, message: 'Error al crear la reserva' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express: Está escuchando en el puerto ${PORT}`);
});

module.exports = app;
