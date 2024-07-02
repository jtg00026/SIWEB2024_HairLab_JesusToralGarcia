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

// Obtener el parámetro idProducto de la URL
const param = new URLSearchParams(window.location.search);
const idProducto = param.get('id');

// Verificar si se obtuvo un idProducto
if (idProducto) {
    // Realizar una solicitud GET al servidor para obtener la información del producto
    axios.get(`/obtenerProducto?id=${idProducto}`)
        .then(response => {
            const producto = response.data;
            mostrarInformacionProducto(producto);
        })
        .catch(error => {
            console.error('Error al obtener la información del producto:', error);
        });
} else {
    console.error('No se ha proporcionado un idProducto en la URL.');
}

// Función para mostrar la información del producto en el HTML
function mostrarInformacionProducto(producto) {
    const infoProducto= document.getElementById('infoProducto');

    // Crear el marco principal
    const marco = document.createElement('div');
    marco.classList.add('marco-principal');

    // Nombre del producto
    const nombre = document.createElement('h2');
    nombre.textContent = producto.nombre;
    marco.appendChild(nombre);

    // Descripción del producto
    const descripcion = document.createElement('p');
    descripcion.textContent = producto.descripcion;
    marco.appendChild(descripcion);

    // Categoría y Subcategoría
    const categoriaSubcategoria = document.createElement('p');
    categoriaSubcategoria.textContent = `Categoría: ${producto.categoria} / Subcategoría: ${producto.subcategoria}`;
    marco.appendChild(categoriaSubcategoria);

    // Precio
    const duracionPrecio = document.createElement('p');
    duracionPrecio.textContent = `Precio: ${producto.precio}€`;
    marco.appendChild(duracionPrecio);

    // Imagen principal del producto
    if (producto.imagen) {
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.classList.add('uniform-size');
        marco.appendChild(imagen);
    }

    // Botón para la compra producto
    const botonReserva = document.createElement('a');

    botonReserva.href = `formalizar-compra.html?id=${idProducto}`; // Enlace a la página de reservas con el id del servicio
    botonReserva.textContent = 'Comprar producto';
    botonReserva.classList.add('btn-reserva');
    marco.appendChild(botonReserva);

    // Añadir el marco principal al contenedor de información del servicio
    infoProducto.appendChild(marco);
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