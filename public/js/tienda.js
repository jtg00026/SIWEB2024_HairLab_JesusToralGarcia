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
 * Métodos de la tienda
 */
document.addEventListener('DOMContentLoaded', async function() {
  const productList = document.getElementById('product-list');
  const searchInput = document.getElementById('search-input');
  const categoryDropdown = document.getElementById('category-dropdown');
  const categoryDropdownContent = document.getElementById('category-dropdown-content');
  const subcategoryDropdown = document.getElementById('subcategory-dropdown');
  const subcategoryDropdownContent = document.getElementById('subcategory-dropdown-content');
  const priceDropdown = document.getElementById('price-dropdown');
  const priceDropdownContent = document.getElementById('price-dropdown-content');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const applyPriceFilterButton = document.getElementById('apply-price-filter');
  const cartItems = document.getElementById('cart-items');
  const checkoutButton = document.getElementById('checkout-button');
  const cartIcon = document.getElementById('cart-icon');
  const cartCount = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');

  let products = []; // Variable para almacenar los productos
  let cart = []; // Variable para almacenar los productos del carrito

  // Función para obtener los productos desde el servidor
  async function obtenerProductos() {
    try {
      const response = await fetch('/obtenerProductos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      alert('Error al obtener los productos. Por favor, intenta nuevamente más tarde.');
      return [];
    }
  }

  // Función para mostrar los productos en la interfaz
  function mostrarProductos(productos) {
    productList.innerHTML = ''; // Limpiar la lista de productos
    if (productos.length === 0) {
      productList.innerHTML = '<p>No se encontraron productos.</p>';
    } else {
      productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('product');
        productoElement.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
          <div class="product-content">
            <h3>${producto.nombre}</h3>
            <p><strong>Categoría:</strong> ${producto.categoria}</p>
            <p><strong>Subcategoría:</strong> ${producto.subcategoria}</p>
            <p>${producto.descripcion}</p>
            <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
            <button class="add-to-cart-button" data-id="${producto.idProducto}">Añadir al carrito</button>
            <button class="buy-button" data-id="${producto.idProducto}">Comprar ahora</button>
          </div>
        `;
        
        // Añadir event listener para abrir más información del producto
        productoElement.addEventListener('click', () => {
          window.location.href = `mas-info-producto.html?id=${producto.idProducto}`;
        });

        // Prevenir la propagación del evento click para los botones dentro del producto
        productoElement.querySelector('.add-to-cart-button').addEventListener('click', (event) => {
          event.stopPropagation();
          agregarAlCarrito(producto);
        });

        productoElement.querySelector('.buy-button').addEventListener('click', (event) => {
          event.stopPropagation();
          window.location.href = `formalizar-compra.html?ids=${producto.idProducto}`;
        });

        productList.appendChild(productoElement);
      });
    }
  }

  // Función para actualizar las opciones del dropdown de subcategoría
  function actualizarSubcategorias(categoriaSeleccionada) {
    let subcategorias = [];

    switch (categoriaSeleccionada) {
      case 'Herramientas de Corte y Peinado':
        subcategorias = ['Peines', 'Tijeras y Navajas', 'Cepillos', 'Máquinas de Cortar', 'Accesorios'];
        break;
      case 'Herramientas de Estilizado':
        subcategorias = ['Planchas', 'Secadores', 'Rizadores'];
        break;
      case 'Productos de Cuidado Capilar':
        subcategorias = ['Tratamientos Capilares', 'Acondicionadores'];
        break;
      case 'Productos de Coloración y Fijación':
        subcategorias = ['Coloración', 'Fijadores'];
        break;
      case 'Equipos y Accesorios de Trabajo':
        subcategorias = ['Capas de Corte', 'Material Higiénico'];
        break;
      default:
        break;
    }

    subcategoryDropdownContent.innerHTML = '';
    if (categoriaSeleccionada !== 'Todos') {
      subcategoryDropdownContent.innerHTML = '<div data-subcategory="Todos">Todos</div>';
    }
    subcategorias.forEach(subcategoria => {
      const option = document.createElement('div');
      option.textContent = subcategoria;
      option.dataset.subcategory = subcategoria; // Guardar el nombre de la subcategoría en el atributo dataset
      subcategoryDropdownContent.appendChild(option);
    });
  }

  // Función para agregar un producto al carrito
  function agregarAlCarrito(producto) {
    cart.push(producto);
    actualizarCarrito();
  }

  // Función para actualizar la visualización del carrito
  function actualizarCarrito() {
    cartItems.innerHTML = '';
    cart.forEach(producto => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="cart-item-image">
        <div class="cart-item-content">
          <h4>${producto.nombre}</h4>
          <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
    cartCount.textContent = cart.length;
  }

  // Función para aplicar filtros
  function aplicarFiltros() {
    let productosFiltrados = [...products];

    const categoriaSeleccionada = categoryDropdown.textContent.trim();
    const subcategoriaSeleccionada = subcategoryDropdown.textContent.trim();
    const filtroNombre = searchInput.value.trim().toLowerCase();
    const minPrecio = parseFloat(minPriceInput.value);
    const maxPrecio = parseFloat(maxPriceInput.value);

    // Filtrar por categoría
    if (categoriaSeleccionada !== 'Categoría' && categoriaSeleccionada !== 'Todos') {
      productosFiltrados = productosFiltrados.filter(producto => producto.categoria === categoriaSeleccionada);
    }

    // Filtrar por subcategoría
    if (subcategoriaSeleccionada !== 'Subcategoría' && subcategoriaSeleccionada !== 'Todos') {
      productosFiltrados = productosFiltrados.filter(producto => producto.subcategoria === subcategoriaSeleccionada);
    }

    // Filtrar por nombre
    if (filtroNombre !== '') {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().includes(filtroNombre)
      );
    }

    // Filtrar por rango de precio
    if (!isNaN(minPrecio) && !isNaN(maxPrecio)) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.precio >= minPrecio && producto.precio <= maxPrecio
      );
    }

    // Mostrar los productos filtrados
    mostrarProductos(productosFiltrados);
  }

  // Event listeners para los dropdowns de categoría, subcategoría y precio
  categoryDropdown.addEventListener('click', () => {
    categoryDropdownContent.classList.toggle('show');
    subcategoryDropdownContent.classList.remove('show');
    priceDropdownContent.classList.remove('show');
  });

  subcategoryDropdown.addEventListener('click', () => {
    subcategoryDropdownContent.classList.toggle('show');
    categoryDropdownContent.classList.remove('show');
    priceDropdownContent.classList.remove('show');
  });

  priceDropdown.addEventListener('click', () => {
    priceDropdownContent.classList.toggle('show');
    categoryDropdownContent.classList.remove('show');
    subcategoryDropdownContent.classList.remove('show');
  });

  // Event listener para el botón de aplicar filtro de precio
  applyPriceFilterButton.addEventListener('click', aplicarFiltros);

  // Event listener para la búsqueda de productos
  searchInput.addEventListener('input', aplicarFiltros);

  // Event listener para seleccionar "Todos" en categoría y subcategoría
  categoryDropdownContent.addEventListener('click', event => {
    const categoriaSeleccionada = event.target.dataset.category;
    if (categoriaSeleccionada) {
      categoryDropdown.textContent = categoriaSeleccionada;
      actualizarSubcategorias(categoriaSeleccionada);
      aplicarFiltros();
      categoryDropdownContent.classList.remove('show');
    }
  });

  subcategoryDropdownContent.addEventListener('click', event => {
    const subcategoriaSeleccionada = event.target.dataset.subcategory;
    if (subcategoriaSeleccionada) {
      subcategoryDropdown.textContent = subcategoriaSeleccionada;
      aplicarFiltros();
      subcategoryDropdownContent.classList.remove('show');
    }
  });

  // Obtener los productos y mostrarlos al cargar la página
  products = await obtenerProductos();
  mostrarProductos(products);

  // Event listener para abrir y cerrar el carrito
  cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
  });

  closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  // Cerrar el modal del carrito al hacer clic fuera de él
  window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  // Cerrar los dropdowns al hacer clic fuera de ellos
  document.addEventListener('click', function(e) {
    if (!categoryDropdown.contains(e.target)) {
      categoryDropdownContent.classList.remove('show');
    }
    if (!subcategoryDropdown.contains(e.target)) {
      subcategoryDropdownContent.classList.remove('show');
    }
    if (!priceDropdown.contains(e.target)) {
      priceDropdownContent.classList.remove('show');
    }
  });

  // Event listener para formalizar compra del carrito
  checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
      const ids = cart.map(producto => producto.idProducto).join(',');
      window.location.href = `formalizar-compra.html?ids=${ids}`;
    }
  });
});
