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

// ==========================================================
// 2. LÓGICA DE LOS BOTONES + / - Y "AGREGAR AL CARRITO"
// ==========================================================
const productosUI = document.querySelectorAll('.item-producto');

productosUI.forEach(producto => {
    // Para cada producto, identificamos sus botones internos
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
                
                // Buscamos específicamente el patrón de un número (con o sin decimales)
                // Esto ignora el punto engañoso del "S/."
                const coincidencia = precioTexto.match(/\d+(\.\d+)?/);
                const precio = coincidencia ? parseFloat(coincidencia[0]) : 0;
                
                procesarCarrito(titulo, precio, cantidadElegida);
                
                inputCantidad.value = 0;
                
                // --- AQUÍ LLAMAMOS A LA NUEVA NOTIFICACIÓN DE ÉXITO ---
                mostrarNotificacion(`✅ ¡Agregaste ${cantidadElegida} x ${titulo} al carrito!`);
            } else {
                // --- AQUÍ LLAMAMOS A LA NOTIFICACIÓN DE ADVERTENCIA ---
                mostrarNotificacion(`⚠️ Usa el botón '+' para elegir la cantidad.`);
            }
        });
    }
});

// ==========================================================
// 3. FUNCIONES DE CÁLCULO DEL CARRITO
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
        totalDinero += (item.precio * item.cantidad);

        const itemHTML = document.createElement('div');
        itemHTML.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <div>
                    <strong>${item.nombre}</strong><br>
                    <span style="color: #666; font-size: 14px;">S/. ${item.precio.toFixed(2)} x ${item.cantidad} uni.</span>
                </div>
                <div style="font-weight: bold; color: #008A4B; font-size: 16px;">
                    S/. ${(item.precio * item.cantidad).toFixed(2)}
                </div>
            </div>
        `;
        listaProductosModal.appendChild(itemHTML);
    });

    if(btnAbrirCarrito) btnAbrirCarrito.innerText = `🛒 Mi Carrito (${totalCantidadProductos})`;
    if(totalModal) totalModal.innerText = `S/. ${totalDinero.toFixed(2)}`;
}

// ==========================================================
// 4. LÓGICA PARA ABRIR Y CERRAR LA VENTANA MODAL
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
// 5. NOTIFICACIONES FLOTANTES (TOAST)
// ==========================================================
function mostrarNotificacion(mensaje) {
    // 1. Buscamos si ya existe el contenedor de notificaciones, si no, lo creamos
    let contenedor = document.getElementById('toast-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-container';
        contenedor.className = 'toast-container';
        document.body.appendChild(contenedor);
    }

    // 2. Creamos la notificación (toast)
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = mensaje; // El emoji y el texto vienen en la variable 'mensaje'

    // 3. Agregamos el toast al contenedor
    contenedor.appendChild(toast);

    // 4. Lo eliminamos del código después de 3 segundos (cuando termina la animación)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}