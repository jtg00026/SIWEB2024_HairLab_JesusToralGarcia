// Mostrar y ocultar dropdown del usuario al hacer clic en el ícono
document.getElementById('usuario-icon').addEventListener('click', function() {
  var dropdown = document.getElementById('usuario-dropdown');
  dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
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

// Ajustes para dispositivos móviles
function toggleMobileMenu() {
  var navbarInteractive = document.querySelector('.navbar4-navbar-interactive');
  var mobileMenu = document.querySelector('.navbar4-mobile-menu');
  navbarInteractive.style.display = navbarInteractive.style.display === 'none' || navbarInteractive.style.display === '' ? 'flex' : 'none';
  mobileMenu.style.display = mobileMenu.style.display === 'none' || mobileMenu.style.display === '' ? 'flex' : 'none';
}

var burgerMenu = document.querySelector('.navbar4-burger-menu');
burgerMenu.addEventListener('click', toggleMobileMenu);

// Cerrar menú móvil al hacer clic en un enlace
var mobileLinks = document.querySelectorAll('.navbar4-mobile-menu a');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', toggleMobileMenu);
});

// Espera a que el contenido de la página se cargue completamente
document.addEventListener("DOMContentLoaded", function() {
  // Ocultar los submenús al cargar la página
  var submenus = document.querySelectorAll('.navbar4-submenu');
  submenus.forEach(function(submenu) {
    submenu.style.display = 'none';
  });
});
