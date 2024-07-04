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

// Esperar a que el contenido de la página se cargue completamente
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
document.addEventListener('DOMContentLoaded', async function() {
  const productSummary = document.getElementById('product-summary');
  const totalPriceElement = document.getElementById('total-price');
  const urlParams = new URLSearchParams(window.location.search);

  // Obtener los IDs de los productos desde el parámetro 'ids'
  const productIdsParam = urlParams.get('ids');
  const productIds = productIdsParam ? productIdsParam.split(',') : [];

  // Función para obtener los detalles del producto por su ID
  async function obtenerDetallesProducto(id) {
      try {
          const response = await fetch(`/obtenerProducto?id=${id}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
      } catch (error) {
          console.error('Error al obtener el producto:', error);
          return null;
      }
  }

  // Mostrar los productos en el resumen
  async function mostrarProductos() {
      let totalPrice = 0;
      const fragment = document.createDocumentFragment();

      // Utilizar un conjunto para evitar productos duplicados
      const uniqueProductIds = [...new Set(productIds)];

      for (const id of uniqueProductIds) {
          const producto = await obtenerDetallesProducto(id);
          if (producto) {
              const productoElement = document.createElement('div');
              productoElement.classList.add('product-summary-item');
              productoElement.innerHTML = `
                  <img src="${producto.imagen}" alt="${producto.nombre}" class="product-summary-image">
                  <div class="product-summary-content">
                      <h3>${producto.nombre}</h3>
                      <p>Precio: $${producto.precio.toFixed(2)}</p>
                  </div>
              `;
              fragment.appendChild(productoElement);
              totalPrice += producto.precio;
          } else {
              const errorElement = document.createElement('div');
              errorElement.textContent = `Error al cargar el producto con ID ${id}.`;
              fragment.appendChild(errorElement);
          }
      }

      productSummary.innerHTML = ''; // Limpiar el contenedor antes de agregar los productos
      productSummary.appendChild(fragment);
      totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  }

  await mostrarProductos(); // Esperar a que los productos se muestren antes de continuar

  // Variable para controlar el estado del proceso de compra
  let isProcessing = false;

  // Event listener para procesar la compra
  document.getElementById('billing-form').addEventListener('submit', async function(event) {
      event.preventDefault();

      // Prevenir múltiple procesamiento
      if (isProcessing) return;
      isProcessing = true;

      // Deshabilitar el botón de envío
      const submitButton = document.querySelector('button[type="submit"]');
      submitButton.disabled = true;

      // Obtener datos del formulario
      const formData = new FormData(this);
      const billingInfo = {
          nombre: formData.get('name'),
          direccion: formData.get('address'),
          ciudad: formData.get('city'),
          estado: formData.get('state'),
          codigoPostal: formData.get('zip'),
          numeroTarjeta: formData.get('card-number'),
          fechaExpiracion: formData.get('expiry-date'),
          cvv: formData.get('cvv')
      };

      // Ejecutar la acción de pagar
      const venta = {
          idVenta: Math.floor(Math.random() * 10000), // Generar un ID de venta aleatorio
          fecha: new Date().toISOString().slice(0, 10),
          total: parseFloat(totalPriceElement.textContent.replace('Total: $', '')),
          estado: "Completada",
          productos: []
      };

      // Utilizar el conjunto uniqueProductIds para evitar productos duplicados
      const uniqueProductIds = [...new Set(productIds)];

      for (const id of uniqueProductIds) {
          const producto = await obtenerDetallesProducto(id);
          if (producto) {
              venta.productos.push({
                  idProducto: producto.idProducto,
                  nombre: producto.nombre,
                  categoria: producto.categoria,
                  descripcion: producto.descripcion,
                  precio: producto.precio
              });
          }
      }

      // Llamar a la función en app.js para agregar la venta
      try {
          const response = await fetch('/formalizarCompra', { // Asegúrate de que la URL sea correcta
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  usuarioDNI: '28745373A',
                  venta: venta
              })
          });
          const result = await response.json();
          if (result.success) {
              alert('Compra realizada con éxito!');
              window.location.href = 'index.html';
          } else {
              alert('Error al realizar la compra: ' + result.message);
          }
      } catch (error) {
          console.error('Error al formalizar la compra:', error);
          alert('Error al realizar la compra.');
      } finally {
          isProcessing = false;
          submitButton.disabled = false;
      }
  });
});
