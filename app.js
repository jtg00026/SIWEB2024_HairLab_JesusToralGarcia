const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const peluquerias = require('./models/peluquerias');
const productos = require('./models/productos');
const servicios = require('./models/servicios');
const usuarios = require('./models/usuarios');
const bodyParser = require('body-parser');

const uri = "mongodb://admin:admin@localhost:27017/bdd?authSource=admin";

mongoose.connect(uri, {})
    .then(() => console.log('Se ha conectado a MongoDB satisfactoriamente.'))
    .catch((e) => console.log("Se ha producido un error: " + e))

const app = express();
const PORT = 3000;

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para manejar las solicitudes POST
app.post('/', (req, res) => {
    const receivedData = req.body.data;
    console.log('Datos enviados al servidor:', receivedData);
    res.send('Datos recibidos correctamente en el servidor.');
});

// Ruta para manejar las solicitudes GET para obtener los servicios
app.get('/obtenerServicios', async (req, res) => {
    try {
        const serviciosObtenidos = await servicios.find();
        console.log("Servicios encontrados:", serviciosObtenidos);
        res.json(serviciosObtenidos);
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Middleware para analizar los datos del cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para manejar el registro de usuarios
app.post('/registrarUsuario', async (req, res) => {
    try {
        const userData = req.body; // Datos del usuario enviados desde el formulario
        console.log('Datos del usuario recibidos:', userData);

        // Crear una instancia del modelo de Usuario con los datos recibidos
        const nuevoUsuario = new usuarios(userData);

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        console.log('Usuario registrado correctamente en la base de datos.');
        res.status(200).send('Usuario registrado correctamente.');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
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
