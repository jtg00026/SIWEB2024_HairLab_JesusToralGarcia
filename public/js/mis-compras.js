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

/**
 * Metodos de pagina
 */
document.addEventListener("DOMContentLoaded", function() {
    const dniUsuario = "28745373A";
    const ventasListado = document.getElementById('ventas-listado');
    const ordenarFecha = document.getElementById('ordenarFecha');
    const ordenarPrecio = document.getElementById('ordenarPrecio');

    async function obtenerVentas() {
        try {
            const response = await fetch(`/obtenerVentas?dni=${dniUsuario}`);
            const ventas = await response.json();
            return ventas;
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
            return [];
        }
    }

    function mostrarVentas(ventas) {
        ventasListado.innerHTML = '';
        ventas.forEach(venta => {
            const ventaDiv = document.createElement('div');
            ventaDiv.classList.add('venta');

            const fechaVenta = new Date(venta.fecha);
            ventaDiv.innerHTML = `
                <h2>Venta ID: ${venta.idVenta}</h2>
                <p>Fecha: ${fechaVenta.toLocaleDateString()}</p>
                <p>Total: ${venta.total.toFixed(2)} €</p>
                <p>Estado: ${venta.estado}</p>
                <h3>Productos:</h3>
                <div class="productos-lista">
                    ${venta.productos.map(producto => `
                        <div class="producto">
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                            <div class="producto-detalle">
                                <p>${producto.nombre}</p>
                                <p>${producto.precio.toFixed(2)} €</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            ventasListado.appendChild(ventaDiv);
        });
    }

    function ordenarVentas(ventas, criterio, orden) {
        return ventas.sort((a, b) => {
            if (criterio === 'fecha') {
                return orden === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
            } else if (criterio === 'precio') {
                return orden === 'asc' ? a.total - b.total : b.total - a.total;
            }
        });
    }

    ordenarFecha.addEventListener('change', async () => {
        const orden = ordenarFecha.value;
        const ventas = await obtenerVentas();
        const ventasOrdenadas = ordenarVentas(ventas, 'fecha', orden);
        mostrarVentas(ventasOrdenadas);
    });

    ordenarPrecio.addEventListener('change', async () => {
        const orden = ordenarPrecio.value;
        const ventas = await obtenerVentas();
        const ventasOrdenadas = ordenarVentas(ventas, 'precio', orden);
        mostrarVentas(ventasOrdenadas);
    });

    obtenerVentas().then(ventas => mostrarVentas(ventas));
});
