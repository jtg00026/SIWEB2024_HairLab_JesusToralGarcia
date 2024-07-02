/**
 * Metodos de la interfaz
 */
// Mostrar y ocultar dropdown del usuario al hacer clic en el ícono
document.getElementById('usuario-icon').addEventListener('click', function() {
    var dropdown = document.getElementById('usuario-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'flex' : 'none';
  });
  
  // Para cerrar el dropdown del usuario si se hace clic fuera de él
  window.addEventListener('click', function(e) {
    var dropdown = document.getElementById('usuario-dropdown');
    var icon = document.getElementById('usuario-icon');
    if (!icon.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  // Mostrar y ocultar submenús al hacer hover sobre los enlaces
  var linkWrappers = document.querySelectorAll('.navbar4-link-wrapper');
  
  linkWrappers.forEach(function(wrapper) {
    wrapper.addEventListener('mouseenter', function() {
      var submenu = wrapper.querySelector('.navbar4-submenu');
      if (submenu) {
        submenu.style.display = 'flex';
      }
    });
  
    wrapper.addEventListener('mouseleave', function() {
      var submenu = wrapper.querySelector('.navbar4-submenu');
      if (submenu) {
        submenu.style.display = 'none';
      }
    });
  });
  
  // Para cerrar el submenú si se hace clic fuera de él
  document.addEventListener('click', function(e) {
    var submenus = document.querySelectorAll('.navbar4-submenu');
    submenus.forEach(function(submenu) {
      if (!submenu.contains(e.target)) {
        submenu.style.display = 'none';
      }
    });
  });
  
  // Cerrar menú móvil al hacer clic en un enlace
  var mobileLinks = document.querySelectorAll('.navbar4-mobile-menu a');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', toggleMobileMenu);
  });
  
  // Espera a que el contenido de la página se cargue completamente
  document.addEventListener("DOMContentLoaded", function() {
    // Ocultar los desplegables al cargar la página
    var dropdowns = document.querySelectorAll('.usuario-dropdown, .navbar4-submenu');
    dropdowns.forEach(function(dropdown) {
      dropdown.style.display = 'none';
    });
  });
  
// Obtener el parámetro idServicio de la URL
const params = new URLSearchParams(window.location.search);
const idServicio = params.get('id');

// Verificar si se obtuvo un idServicio
if (idServicio) {
    // Realizar una solicitud GET al servidor para obtener la información del servicio
    axios.get(`/obtenerServicio?id=${idServicio}`)
        .then(response => {
            const servicio = response.data;
            mostrarInformacionServicio(servicio);
        })
        .catch(error => {
            console.error('Error al obtener la información del servicio:', error);
        });
} else {
    console.error('No se ha proporcionado un idServicio en la URL.');
}

// Función para mostrar la información del servicio en el HTML
function mostrarInformacionServicio(servicio) {
    const infoServicio = document.getElementById('infoServicio');

    // Crear el marco principal
    const marco = document.createElement('div');
    marco.classList.add('marco-principal');

    // Nombre del servicio
    const nombreServicio = document.createElement('h2');
    nombreServicio.textContent = servicio.nombre;
    marco.appendChild(nombreServicio);

    // Descripción del servicio
    const descripcion = document.createElement('p');
    descripcion.textContent = servicio.descripcion;
    marco.appendChild(descripcion);

    // Categoría y Subcategoría
    const categoriaSubcategoria = document.createElement('p');
    categoriaSubcategoria.textContent = `Categoría: ${servicio.categoria} / Subcategoría: ${servicio.subcategoria}`;
    marco.appendChild(categoriaSubcategoria);

    // Duración y Precio
    const duracionPrecio = document.createElement('p');
    duracionPrecio.textContent = `Duración: ${servicio.duracion} minutos / Precio: ${servicio.precio}€`;
    marco.appendChild(duracionPrecio);

    // Dificultad
    const dificultad = document.createElement('p');
    dificultad.textContent = `Dificultad: ${servicio.dificultad}`;
    marco.appendChild(dificultad);

    // Imagen principal del servicio
    if (servicio.enlaceImagen) {
        const imagen = document.createElement('img');
        imagen.src = servicio.enlaceImagen;
        imagen.alt = servicio.nombre;
        imagen.classList.add('uniform-size');
        marco.appendChild(imagen);
    }

    // Procedimiento
    if (servicio.masinfo.procedimiento && servicio.masinfo.procedimiento.length > 0) {
        const procedimientoTitulo = document.createElement('h3');
        procedimientoTitulo.textContent = 'Procedimiento';
        marco.appendChild(procedimientoTitulo);

        const procedimientoLista = document.createElement('ol');
        servicio.masinfo.procedimiento.forEach(paso => {
            const li = document.createElement('li');
            li.textContent = `Paso ${paso.paso}: ${paso.descripcion}`;
            procedimientoLista.appendChild(li);
        });
        marco.appendChild(procedimientoLista);
    }

    // Herramientas
    if (servicio.masinfo.herramientas && servicio.masinfo.herramientas.length > 0) {
        const herramientasTitulo = document.createElement('h3');
        herramientasTitulo.textContent = 'Herramientas';
        marco.appendChild(herramientasTitulo);

        const herramientasContenedor = document.createElement('div');
        herramientasContenedor.classList.add('group-container');

        servicio.masinfo.herramientas.forEach(herramienta => {
            const herramientaMarco = document.createElement('div');
            herramientaMarco.classList.add('rounded-box');

            const herramientaNombre = document.createElement('h4');
            herramientaNombre.textContent = herramienta.nombre;
            herramientaMarco.appendChild(herramientaNombre);

            const herramientaDescripcion = document.createElement('p');
            herramientaDescripcion.textContent = herramienta.descripcion;
            herramientaMarco.appendChild(herramientaDescripcion);

            const herramientaPrecio = document.createElement('p');
            herramientaPrecio.textContent = `Precio: $${herramienta.precio}`;
            herramientaMarco.appendChild(herramientaPrecio);

            if (herramienta.imagen) {
                const herramientaImagen = document.createElement('img');
                herramientaImagen.src = herramienta.imagen;
                herramientaImagen.alt = herramienta.nombre;
                herramientaImagen.classList.add('uniform-size');
                herramientaMarco.appendChild(herramientaImagen);
            }

            herramientasContenedor.appendChild(herramientaMarco);
        });

        marco.appendChild(herramientasContenedor);
    }

    // Productos
    if (servicio.masinfo.productos && servicio.masinfo.productos.length > 0) {
        const productosTitulo = document.createElement('h3');
        productosTitulo.textContent = 'Productos';
        marco.appendChild(productosTitulo);

        const productosContenedor = document.createElement('div');
        productosContenedor.classList.add('group-container');

        servicio.masinfo.productos.forEach(producto => {
            const productoMarco = document.createElement('div');
            productoMarco.classList.add('rounded-box');

            const productoNombre = document.createElement('h4');
            productoNombre.textContent = producto.nombre;
            productoMarco.appendChild(productoNombre);

            const productoDescripcion = document.createElement('p');
            productoDescripcion.textContent = producto.descripcion;
            productoMarco.appendChild(productoDescripcion);

            const productoPrecio = document.createElement('p');
            productoPrecio.textContent = `Precio: $${producto.precio}`;
            productoMarco.appendChild(productoPrecio);

            if (producto.imagen) {
                const productoImagen = document.createElement('img');
                productoImagen.src = producto.imagen;
                productoImagen.alt = producto.nombre;
                productoImagen.classList.add('uniform-size');
                productoMarco.appendChild(productoImagen);
            }

            productosContenedor.appendChild(productoMarco);
        });

        marco.appendChild(productosContenedor);
    }

    // Cuidados Posteriores
    if (servicio.masinfo.cuidadosPosteriores && servicio.masinfo.cuidadosPosteriores.length > 0) {
        const cuidadosPosterioresTitulo = document.createElement('h3');
        cuidadosPosterioresTitulo.textContent = 'Cuidados Posteriores';
        marco.appendChild(cuidadosPosterioresTitulo);

        const cuidadosPosterioresLista = document.createElement('ul');
        servicio.masinfo.cuidadosPosteriores.forEach(cuidado => {
            const li = document.createElement('li');
            li.textContent = cuidado;
            cuidadosPosterioresLista.appendChild(li);
        });
        marco.appendChild(cuidadosPosterioresLista);
    }

    // Imágenes Adicionales
    if (servicio.masinfo.imagenesAdicionales && servicio.masinfo.imagenesAdicionales.length > 0) {
        const imagenesAdicionalesTitulo = document.createElement('h3');
        imagenesAdicionalesTitulo.textContent = 'Imágenes Adicionales';
        marco.appendChild(imagenesAdicionalesTitulo);

        const imagenesAdicionalesContenedor = document.createElement('div');
        imagenesAdicionalesContenedor.classList.add('additional-images');

        servicio.masinfo.imagenesAdicionales.forEach(imagenSrc => {
            const imagenAdicional = document.createElement('img');
            imagenAdicional.src = imagenSrc;
            imagenAdicional.alt = 'Imagen adicional';
            imagenAdicional.classList.add('uniform-size');
            imagenesAdicionalesContenedor.appendChild(imagenAdicional);
        });
        marco.appendChild(imagenesAdicionalesContenedor);
    }

    // Botón para la página de reservas
    const botonReserva = document.createElement('a');

    botonReserva.href = `reservar.html?id=${idServicio}`; // Enlace a la página de reservas con el id del servicio
    botonReserva.textContent = 'Reserva tu cita';
    botonReserva.classList.add('btn-reserva');
    marco.appendChild(botonReserva);

    // Añadir el marco principal al contenedor de información del servicio
    infoServicio.appendChild(marco);
}

// Estilos CSS para el botón de reserva
const style = document.createElement('style');
style.textContent = `
    .marco-principal {
        display: flex;
        flex-direction: column;
        align-items: center; /* Centra el contenido horizontalmente */
    }

    .btn-reserva {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: var(--dl-color-theme-primary1);
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        transition: background-color 0.3s;
    }
    
    .btn-reserva:hover {
        background-color: var(--dl-color-theme-primary2);
    }
`;
document.head.appendChild(style);

function obtenerIdServicio() {
    // Obtener el parámetro idServicio de la URL
    const params = new URLSearchParams(window.location.search);
    const idServicio = params.get('id');

    return idServicio;
}