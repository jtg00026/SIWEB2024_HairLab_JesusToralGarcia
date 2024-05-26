// Obtener el ID del servicio de la URL
const urlParams = new URLSearchParams(window.location.search);
const servicioId = urlParams.get('id');

// Realizar una solicitud AJAX para obtener la información del servicio
axios.get(`/obtenerServicio?id=${servicioId}`)
    .then(response => {
        console.log('Respuesta del servidor:', response.data); // Agrega esta línea para verificar la respuesta del servidor
        const servicio = response.data;
        // Rellenar los campos de información con los datos del servicio
        document.getElementById('infoServicio').innerHTML = `
            <h2>${servicio.nombre}</h2>
            <p>Duración: ${servicio.duracion} minutos</p>
            <p>Precio: ${servicio.precio} €</p>
            <p>Categoría: ${servicio.categoria}</p>
            <p>Subcategoría: ${servicio.subcategoria}</p>
            <p>Descripción: ${servicio.descripcion}</p>
            <p>Dificultad: ${servicio.dificultad}</p>
            <!-- Agrega cualquier otro campo que desees mostrar -->
        `;
    })
    .catch(error => {
        console.error('Error al obtener la información del servicio:', error);
    });
