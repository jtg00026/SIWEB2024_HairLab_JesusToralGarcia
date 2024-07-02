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
 * Metodos de la pagina
 */
