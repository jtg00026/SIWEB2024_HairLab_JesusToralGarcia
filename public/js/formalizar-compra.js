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

    async function mostrarProductos() {
        let totalPrice = 0;
        const fragment = document.createDocumentFragment();
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

        productSummary.innerHTML = '';
        productSummary.appendChild(fragment);
        totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    await mostrarProductos();

    let isProcessing = false;

    document.getElementById('billing-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        if (isProcessing) return;
        isProcessing = true;

        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;

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

        const venta = {
            idVenta: Math.floor(Math.random() * 10000),
            fecha: new Date().toISOString().slice(0, 10),
            total: parseFloat(totalPriceElement.textContent.replace('Total: $', '')),
            estado: "Completada",
            productos: []
        };

        const uniqueProductIds = [...new Set(productIds)];

        for (const id of uniqueProductIds) {
            const producto = await obtenerDetallesProducto(id);
            if (producto) {
                venta.productos.push({
                    idProducto: producto.idProducto,
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    imagen: producto.imagen
                });
            }
        }

        try {
            const response = await fetch('/formalizarCompra', {
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
                generarFacturaPDF(billingInfo, venta);
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

    function generarFacturaPDF(billingInfo, venta) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(12);
        doc.text('Factura de Compra', 105, 10, null, null, 'center');
        doc.text(`Fecha: ${venta.fecha}`, 10, 20);
        doc.text(`ID de Venta: ${venta.idVenta}`, 10, 30);

        doc.text('Información de Facturación:', 10, 40);
        doc.text(`Nombre: ${billingInfo.nombre}`, 10, 50);
        doc.text(`Dirección: ${billingInfo.direccion}`, 10, 60);
        doc.text(`Ciudad: ${billingInfo.ciudad}`, 10, 70);
        doc.text(`Estado/Provincia: ${billingInfo.estado}`, 10, 80);
        doc.text(`Código Postal: ${billingInfo.codigoPostal}`, 10, 90);

        doc.text('Productos:', 10, 110);
        let yPosition = 120;
        venta.productos.forEach((producto) => {
            doc.text(`Nombre: ${producto.nombre}`, 10, yPosition);
            doc.text(`Precio: $${producto.precio.toFixed(2)}`, 10, yPosition + 10);
            // Añadir la imagen del producto
            doc.addImage(producto.imagen, 'JPEG', 160, yPosition - 10, 40, 30);
            yPosition += 40;
        });

        doc.text(`Total: $${venta.total.toFixed(2)}`, 10, yPosition + 20);

        doc.save('Factura.pdf');
    }
});
