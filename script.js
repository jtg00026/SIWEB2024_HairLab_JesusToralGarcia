const mongoose = require('mongoose')
const Usuarios = require('./USUARIOS')

const db = 'mongodb://admin:admin@localhost:27017/'

mongoose.connect(db)

mongoose.connection.on('connected', () => {
    console.log('Conexión establecida con éxito a MongoDB');

})

mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB: ', err);

})

mongoose.connection.on('disconnected', () => {
    console.log('Conexión a MongoDB cerrada.');

})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a MongoDB cerrada debido a terminación de la aplicación.');
        process.exit(0);
    });

})

run()
async function run() {
    try{
        /*
        const user = await Usuarios.create({
            name: "Kyle",
            age: 26,
            email: "TEST@test.com",
            hobbies: ["a", "b"],
            address: {
                street: "calle"
            },
        })
        user.createdAt = 5
        await user.save()
        console.log(user)
        */
        const user = await Usuarios.findOne({name: "Kyle"})
        console.log(user)
    }catch (e) {
        console.log(e.message)
    }
}