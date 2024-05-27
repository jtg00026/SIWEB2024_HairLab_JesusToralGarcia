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
   * Metodos de filtrado
   */
  document.addEventListener("DOMContentLoaded", async function () {
    const serviciosLista = document.getElementById("servicios-lista");
    const categoriaButtons = document.querySelectorAll(".categoria-button");
    const subcategoriaButtons = document.querySelectorAll(".subcategoria-button");

    categoriaButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const categoria = button.dataset.categoria;
            await actualizarListaServicios(categoria);
        });
    });

    subcategoriaButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const subcategoria = button.dataset.subcategoria;
            await actualizarListaServicios(subcategoria);
        });
    });

    // Función para actualizar la lista de servicios según la categoría o subcategoría seleccionada
    async function actualizarListaServicios(filtro) {
        serviciosLista.innerHTML = ""; // Limpiar la lista de servicios antes de actualizarla

        try {
            // Realizar la lógica de filtrado de servicios aquí, utilizando la variable 'filtro' para aplicar el filtro deseado
            // Por ejemplo, podrías hacer una petición a tu base de datos para obtener los servicios filtrados y luego mostrarlos en la página
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
            alert('Error al cargar los servicios. Por favor, intenta de nuevo más tarde.');
        }
    }

    // Llamar a actualizarListaServicios al cargar la página para mostrar todos los servicios por defecto
    await actualizarListaServicios("todos");
});