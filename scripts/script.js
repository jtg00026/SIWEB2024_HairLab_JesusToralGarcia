const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://admin:admin@localhost:27017/bdd?authSource=admin";

    const client = new MongoClient(uri);

    try {
        console.log('Conectándose al clúster de MongoDB...');
        // Conectarse al clúster de MongoDB
        await client.connect();
        console.log('Conexión establecida con éxito.');

        // Cuerpo de la funcion
        await findPeluquerias(client);

    } catch (e) {
        console.error('Error al conectarse a MongoDB:', e);
    } finally {
        // Cerrar la conexión al clúster de MongoDB
        await client.close();
        console.log('Conexión cerrada con MongoDB.');
    }
}

async function findPeluquerias(client) {
    // Base de datos y colección a la que se realizará la búsqueda
    const database = client.db("bdd");
    const collection = database.collection("PELUQUERIAS");

    // Servicio específico que se está buscando
    const servicioBuscado = "Corte de pelo masculino";
    const regex = new RegExp(servicioBuscado, 'i');

    // Realizar la consulta
    console.log('Realizando la consulta...');
    const peluqueriasQueOfrecenServicio = await collection.find({ "servicios.nombre": regex }).toArray();

    // Mostrar el resultado
    console.log("Peluquerías que ofrecen el servicio de '" + servicioBuscado + "':");
    console.log(peluqueriasQueOfrecenServicio);
}

main().catch(console.error);
