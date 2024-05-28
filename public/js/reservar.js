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
   * Codigo formalizar reserva
   */
  /**
 * Código para formalizar reserva
 */
document.addEventListener('DOMContentLoaded', function() {
    const reservarForm = document.getElementById('reservarForm');
  
    if (reservarForm) {
        reservarForm.addEventListener('submit', function(event) {
            event.preventDefault();
  
            const formData = new FormData(reservarForm);
            const data = Object.fromEntries(formData.entries());
            const urlParams = new URLSearchParams(window.location.search);
            const idServicio = urlParams.get('id');
  
            fetch('/estaAutenticado', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al verificar autenticación');
                }
                return response.json();
            })
            .then(result => {
                if (result.autenticado) {
                    fetch('/reservar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fecha: data.fecha,
                            hora: data.hora,
                            idServicio: idServicio
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(error => {
                                throw new Error(error.message || 'Error al crear la reserva');
                            });
                        }
                        return response.json();
                    })
                    .then(result => {
                        if (result.success) {
                            alert('Reserva creada con éxito');
                        } else {
                            alert('Error al crear la reserva: ' + result.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error al crear la reserva');
                    });
                } else {
                    alert('Debe iniciar sesión para realizar una reserva');
                    window.location.href = 'inicio-sesion.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al verificar la autenticación');
            });
        });
    } else {
        console.error("El formulario de reserva no se encuentra en el DOM.");
    }
  });