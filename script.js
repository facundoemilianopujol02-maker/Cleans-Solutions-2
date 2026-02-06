// ===== ELEMENTOS DEL DOM ===== //
// NOTA: Algunos elementos ya están definidos en index.html
// Solo definimos los que necesitamos específicamente aquí

// ===== CONFIGURACIÓN ===== //
const PASSWORD_ADMIN = "Ragnar2025";
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0eqYlaid0AgmFVRwRaUG_GMUvcSSeD40AXeLQVUqwAlo4mbRP2VyaG_QZW-l-WS_j/exec';

// ===== FUNCIONES AUXILIARES ===== //
function mostrarError(mensaje, elemento = null) {
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.display = "block";
        setTimeout(function() {
            elemento.style.display = "none";
        }, 3000);
    } else {
        console.error(mensaje);
    }
}

// ===== SISTEMA DE ADMINISTRADOR ===== //
// (Estas funciones son de respaldo en caso de que falle el script principal)

// Función para verificar contraseña (compatibilidad)
function verificarPassword() {
    const inputPassword = document.getElementById('inputPassword');
    const mensajeError = document.getElementById('mensajeError');
    const panelAdmin = document.getElementById('panelAdmin');
    const btnAdmin = document.getElementById('btnAdmin');
    
    if (!inputPassword || !mensajeError || !panelAdmin || !btnAdmin) {
        console.error("Elementos necesarios no encontrados");
        return;
    }
    
    const passwordIngresada = inputPassword.value;
    
    if (passwordIngresada === "") {
        mostrarError('Por favor ingrese una contraseña', mensajeError);
        return;
    }
    
    if (passwordIngresada === PASSWORD_ADMIN) {
        console.log("Acceso concedido");
        
        // Ocultar modal
        const modalPassword = document.getElementById('modalPassword');
        if (modalPassword) modalPassword.style.display = 'none';
        
        // Mostrar panel admin
        panelAdmin.style.display = 'flex';
        
        // Agregar clase al body para modo admin
        document.body.classList.add('modo-admin');
        
        // Guardar en localStorage
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Limpiar input
        inputPassword.value = "";
        
    } else {
        mostrarError("Contraseña incorrecta, inténtalo otra vez", mensajeError);
        inputPassword.value = "";
        inputPassword.focus();
    }
}

// ========== FUNCIÓN PARA CERRAR SESIÓN ADMIN ==========
function cerrarSesionAdmin() {
    console.log("Cerrando sesión de administrador");
    
    const panelAdmin = document.getElementById('panelAdmin');
    const btnAdmin = document.getElementById('btnAdmin');
    
    if (!panelAdmin || !btnAdmin) {
        console.error("Error: Elementos no encontrados");
        return;
    }
    
    // Ocultar panel de admin
    panelAdmin.style.display = 'none';
    
    // Remover clase modo admin
    document.body.classList.remove('modo-admin');
    
    // Remover del localStorage
    localStorage.removeItem('adminLoggedIn');
    
    console.log("Sesión de administrador cerrada");
}

// ===== EVENT LISTENERS DE RESPALDO ===== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de respaldo cargado completamente');
    
    // Verificar si ya estamos en modo admin al cargar la página
    if (document.body.classList.contains('modo-admin')) {
        console.log('Modo admin detectado al cargar');
        const panelAdmin = document.getElementById('panelAdmin');
        if (panelAdmin) panelAdmin.style.display = 'flex';
    }
    
    // Event listener para tecla ENTER en input de password (respaldo)
    const inputPassword = document.getElementById('inputPassword');
    if (inputPassword) {
        inputPassword.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                verificarPassword();
            }
        });
    }
    
    // Event listeners para botones de panel admin (respaldo)
    const btnAgregar = document.getElementById('btnAgregar');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnCerrarAdmin = document.getElementById('btnCerrarAdmin');
    
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            console.log('Abriendo modal para agregar producto (respaldo)');
            const panelAdmin = document.getElementById('panelAdmin');
            const modalProducto = document.getElementById('modalProducto');
            
            if (panelAdmin) panelAdmin.style.display = 'none';
            if (modalProducto) {
                modalProducto.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            alert("Funcionalidad 'Eliminar Producto' se implementará pronto");
        });
    }
    
    if (btnCerrarAdmin) {
        btnCerrarAdmin.addEventListener('click', cerrarSesionAdmin);
    }
    
    // Event listener para formulario de producto (respaldo)
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Enviando formulario de producto (respaldo)...');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('message');
            
            if (!submitBtn) return;
            
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            if (messageDiv) {
                messageDiv.textContent = 'Enviando producto...';
                messageDiv.style.color = '#0c5460';
                messageDiv.style.backgroundColor = '#d1ecf1';
                messageDiv.style.display = 'block';
            }
            
            // Obtener datos del formulario
            const productData = {
                id: document.getElementById('id')?.value.trim() || '',
                nombre: document.getElementById('nombre')?.value.trim() || '',
                precio: document.getElementById('precio')?.value.trim() || '',
                imagen: document.getElementById('imagen')?.value.trim() || '',
                descripcion: document.getElementById('descripcion')?.value.trim() || ''
            };
            
            console.log('Datos a enviar (respaldo):', productData);
            
            // Validación
            if (!productData.id || !productData.nombre || !productData.precio) {
                if (messageDiv) {
                    messageDiv.textContent = '❌ Completa ID, Nombre y Precio';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.backgroundColor = '#f8d7da';
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            try {
                // Enviar a Google Sheets
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(productData)
                });
                
                console.log('✅ Producto enviado a Google Sheets (respaldo)');
                
                if (messageDiv) {
                    messageDiv.textContent = '✅ Producto agregado correctamente!';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.backgroundColor = '#d4edda';
                }
                
                // Limpiar formulario
                if (form) form.reset();
                
                // Cerrar modal después de 2 segundos
                setTimeout(() => {
                    const modalProducto = document.getElementById('modalProducto');
                    if (modalProducto) {
                        modalProducto.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                    window.location.reload();
                }, 2000);
                
            } catch(error) {
                console.error('❌ Error al enviar (respaldo):', error);
                
                if (messageDiv) {
                    messageDiv.textContent = '❌ Error al agregar producto';
                    messageDiv.style.color = '#721c24';
                    messageDiv.style.backgroundColor = '#f8d7da';
                }
                
                submitBtn.textContent = '⚠️ Reintentar';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Verificar que todos los elementos necesarios existan
    const elementosRequeridos = [
        { nombre: 'btnAdmin', elemento: document.getElementById('btnAdmin') },
        { nombre: 'modalProducto', elemento: document.getElementById('modalProducto') },
        { nombre: 'form', elemento: document.getElementById('productForm') }
    ];
    
    elementosRequeridos.forEach(item => {
        if(!item.elemento) {
            console.warn(`Elemento no encontrado: ${item.nombre}`);
        }
    });
});

// ===== SISTEMA DE TIMEOUT AUTOMÁTICO ===== //
// Cerrar sesión automáticamente después de una hora
setTimeout(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        console.log('Sesión de admin expirada (timeout automático)');
        localStorage.removeItem('adminLoggedIn');
        
        const panelAdmin = document.getElementById('panelAdmin');
        if (panelAdmin) panelAdmin.style.display = 'none';
        
        document.body.classList.remove('modo-admin');
    }
}, 3600000); // 1 hora = 3600000 ms