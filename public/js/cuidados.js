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
  

  document.addEventListener('DOMContentLoaded', () => {
    console.log('Sección Peluquería cargada');
    // Puedes añadir más funcionalidad aquí si es necesario.
 });
 
/**
 * Metodos para el cuerpo de pagina
 */
const frames = document.querySelectorAll('.frame');

// Add mousemove event listener to each frame
frames.forEach((frame) => {
  frame.addEventListener('mousemove', (e) => {
    const x = e.pageX - frame.offsetLeft;
    const y = e.pageY - frame.offsetTop;
    const width = frame.offsetWidth;
    const height = frame.offsetHeight;
    const rotateX = -(y - height / 2) / (height / 2) * 10;
    const rotateY = (x - width / 2) / (width / 2) * -10;
    frame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  // Add mouseleave event listener to each frame
  frame.addEventListener('mouseleave', () => {
    frame.style.transform = 'none';
  });

  // Add click event listener to each frame
  frame.addEventListener('click', () => {
    frame.style.transition = 'transform 0.5s ease-out';
    frame.style.transform = 'scale(1.2)';
    setTimeout(() => {
      frame.style.transition = 'transform 0.3s ease-in-out';
      frame.style.transform = 'none';
    }, 500);
  });
});

// Get the container element
const container = document.querySelector('.container');

// Get the width of the container
const containerWidth = container.offsetWidth;

// Calculate the width of each frame
const frameWidth = (containerWidth - 60) / 3;

// Set the width of each frame
frames.forEach((frame) => {
  frame.style.width = `${frameWidth}px`;
});

// Set the height of each frame
const frameHeight = frameWidth * 0.75; // Adjust the height-to-width ratio as needed
frames.forEach((frame) => {
  frame.style.height = `${frameHeight}px`;
});

// Add responsiveness to the frames
window.addEventListener('resize', () => {
  const containerWidth = container.offsetWidth;
  const frameWidth = (containerWidth - 60) / 3;
  frames.forEach((frame) => {
    frame.style.width = `${frameWidth}px`;
    frame.style.height = `${frameWidth * 0.75}px`;
  });
});