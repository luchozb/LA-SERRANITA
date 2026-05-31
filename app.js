// ==========================================================
// 1. VARIABLES GLOBALES (El "cerebro" de tu carrito)
// ==========================================================
let carrito = [];

// Referencias a la ventana del carrito (Modal)
const btnAbrirCarrito = document.getElementById('btn-abrir-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const overlayModal = document.getElementById('overlay-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const listaProductosModal = document.getElementById('lista-productos-modal');
const totalModal = document.getElementById('total-modal');
const btnConfirmarCompra = document.getElementById('btn-confirmar-compra'); // Nuevo botón WhatsApp

// ==========================================================
// 2. LÓGICA DE LOS BOTONES + / - Y "AGREGAR AL CARRITO" (Página Principal)
// ==========================================================
const productosUI = document.querySelectorAll('.item-producto');

productosUI.forEach(producto => {
    const btnRestar = producto.querySelector('.btn-restar');
    const btnSumar = producto.querySelector('.btn-sumar');
    const inputCantidad = producto.querySelector('.input-cantidad');
    const btnAgregar = producto.querySelector('.btn-agregar');

    // Funcionalidad del botón SUMAR (+)
    if(btnSumar) {
        btnSumar.addEventListener('click', () => {
            let valorActual = parseInt(inputCantidad.value) || 0;
            inputCantidad.value = valorActual + 1;
        });
    }

    // Funcionalidad del botón RESTAR (-)
    if(btnRestar) {
        btnRestar.addEventListener('click', () => {
            let valorActual = parseInt(inputCantidad.value) || 0;
            if (valorActual > 0) { 
                inputCantidad.value = valorActual - 1;
            }
        });
    }

    // Funcionalidad del botón AGREGAR AL CARRITO
    if(btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            const cantidadElegida = parseInt(inputCantidad.value) || 0;
            
            if (cantidadElegida > 0) {
                const titulo = producto.querySelector('h3').innerText;
                const precioTexto = producto.querySelector('.precio').innerText;
                
                const coincidencia = precioTexto.match(/\d+(\.\d+)?/);
                const precio = coincidencia ? parseFloat(coincidencia[0]) : 0;
                
                procesarCarrito(titulo, precio, cantidadElegida);
                
                inputCantidad.value = 0;
                mostrarNotificacion(`✅ ¡Agregaste ${cantidadElegida} x ${titulo} al carrito!`);
            } else {
                mostrarNotificacion(`⚠️ Usa el botón '+' para elegir la cantidad.`);
            }
        });
    }
});

// ==========================================================
// 3. FUNCIONES DE CÁLCULO Y RENDERIZADO DEL CARRITO
// ==========================================================
function procesarCarrito(nombre, precio, cantidad) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    actualizarInterfaz();
}

function actualizarInterfaz() {
    let totalCantidadProductos = 0;
    let totalDinero = 0;

    listaProductosModal.innerHTML = '';

    carrito.forEach((item) => {
        totalCantidadProductos += item.cantidad;
        const subtotal = item.precio * item.cantidad;
        totalDinero += subtotal;

        // Aquí dibujamos el HTML usando las clases CSS que agregamos antes
        const itemHTML = document.createElement('div');
        itemHTML.className = 'item-carrito-modal';
        itemHTML.innerHTML = `
            <div class="info-producto-carrito">
                <h4>${item.nombre}</h4>
                <p>S/. ${item.precio.toFixed(2)} c/u</p>
            </div>
            <div class="controles-carrito">
                <button class="btn-restar-carrito" data-nombre="${item.nombre}">-</button>
                <span class="cantidad-carrito">${item.cantidad}</span>
                <button class="btn-sumar-carrito" data-nombre="${item.nombre}">+</button>
                <button class="btn-eliminar-carrito" data-nombre="${item.nombre}">🗑️</button>
            </div>
            <div class="subtotal-carrito">
                S/. ${subtotal.toFixed(2)}
            </div>
        `;
        listaProductosModal.appendChild(itemHTML);
    });

    if(btnAbrirCarrito) btnAbrirCarrito.innerText = `🛒 Mi Carrito (${totalCantidadProductos})`;
    if(totalModal) totalModal.innerText = `S/. ${totalDinero.toFixed(2)}`;

    // MUY IMPORTANTE: Le damos "vida" a los nuevos botones que acabamos de crear
    asignarEventosModal();
}

// ==========================================================
// 4. LÓGICA DE LOS BOTONES INTERNOS DEL CARRITO (+, -, 🗑️)
// ==========================================================
function asignarEventosModal() {
    // Botón Sumar en modal
    document.querySelectorAll('.btn-sumar-carrito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.target.getAttribute('data-nombre');
            const producto = carrito.find(item => item.nombre === nombre);
            if(producto) producto.cantidad++;
            actualizarInterfaz();
        });
    });

    // Botón Restar en modal
    document.querySelectorAll('.btn-restar-carrito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.target.getAttribute('data-nombre');
            const producto = carrito.find(item => item.nombre === nombre);
            if(producto) {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    actualizarInterfaz();
                } else {
                    eliminarDelCarrito(nombre); // Si es 1 y resta, se elimina
                }
            }
        });
    });

    // Botón Eliminar (Basurero)
    document.querySelectorAll('.btn-eliminar-carrito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.target.getAttribute('data-nombre');
            eliminarDelCarrito(nombre);
        });
    });
}

function eliminarDelCarrito(nombre) {
    // Filtramos dejando todos excepto el que queremos eliminar
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarInterfaz();
    mostrarNotificacion(`🗑️ Eliminaste ${nombre} del carrito.`);
}

// ==========================================================
// 5. LÓGICA PARA ABRIR Y CERRAR LA VENTANA MODAL
// ==========================================================
if(btnAbrirCarrito) {
    btnAbrirCarrito.addEventListener('click', () => {
        modalCarrito.classList.remove('oculto');
        overlayModal.classList.remove('oculto');
    });
}

const cerrarVentanaCarrito = () => {
    modalCarrito.classList.add('oculto');
    overlayModal.classList.add('oculto');
};

if(btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarVentanaCarrito);
if(overlayModal) overlayModal.addEventListener('click', cerrarVentanaCarrito);

// ==========================================================
// 6. ENVIAR PEDIDO A WHATSAPP
// ==========================================================
if(btnConfirmarCompra) {
    btnConfirmarCompra.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarNotificacion("⚠️ Tu carrito está vacío. ¡Agrega productos primero!");
            return;
        }

        let mensaje = "*¡Hola La Serranita!* 👋\nQuiero realizar el siguiente pedido:\n\n";
        let total = 0;

        carrito.forEach(producto => {
            const subtotal = producto.cantidad * producto.precio;
            total += subtotal;
            mensaje += `🔸 *${producto.cantidad}x* ${producto.nombre} - S/. ${subtotal.toFixed(2)}\n`;
        });

        mensaje += `\n*Total a pagar: S/. ${total.toFixed(2)}*\n\n`;
        mensaje += "Por favor, confírmenme el pedido y cómo realizo el pago. ¡Gracias!";

        const numeroWhatsApp = "51964970065"; 
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        
        window.open(urlWhatsApp, '_blank');
    });
}

// ==========================================================
// 7. NOTIFICACIONES FLOTANTES (TOAST)
// ==========================================================
function mostrarNotificacion(mensaje) {
    let contenedor = document.getElementById('toast-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-container';
        contenedor.className = 'toast-container';
        document.body.appendChild(contenedor);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = mensaje; 

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}