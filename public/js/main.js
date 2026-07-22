function toggleMenu() {
      const menu = document.getElementById("menu-desplegable");
      menu.classList.toggle("show");
    }

    
  function showToast(mensaje, tipo = 'success') {
    const modalReporteAbierto = document.getElementById('modalReporte')?.style.display === 'flex';
    const modalComentariosAbierto = document.getElementById('modalComentarios')?.style.display === 'flex';
    
    let containerId;
    if (modalReporteAbierto || (!modalComentariosAbierto)) {
        containerId = 'toast-container-global';
    } else {
        containerId = 'toast-container';
    }
    
    const container = document.getElementById(containerId);
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
//COleccion
// 1. Mostrar/Ocultar el formulario al hacer clic en el botón
function toggleColeccion(btn) {
    const form = btn.nextElementSibling;
    form.classList.toggle('oculto');
}


function checkNueva(select) {
    const form = select.closest('form'); // Busca el form padre
    const input = form.querySelector('.input-nueva'); // Busca dentro del form
    
    if (select.value === 'nueva') {
        input.style.display = 'block';
        input.required = true;
    } else {
        input.style.display = 'none';
        input.required = false;
    }
}

async function eliminarColeccion(idColeccion) {
    if (!confirm('¿Estás seguro de que querés eliminar esta colección?')) {
        return;
    }

    try {
        const response = await fetch(`/colecciones/${idColeccion}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Colección eliminada correctamente.', 'success');
         
            const tarjeta = document.getElementById(`coleccion-${idColeccion}`);
            if (tarjeta) {
                tarjeta.remove();
            }
        } else {
            showToast(data.error || 'Error al eliminar la colección.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión con el servidor.', 'error');
    }
}

async function quitarDeColeccion(idColeccion, idPublicacion) {
        if (!confirm('¿Seguro querés quitar esta publicación de la colección?')) return;

        try {
            const res = await fetch(`/colecciones/${idColeccion}/publicaciones/${idPublicacion}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                showToast(data.message || 'Publicación removida', 'success');
                // Borramos la tarjeta visualmente al instante
                document.getElementById(`pub-en-col-${idPublicacion}`)?.remove();
            } else {
                showToast(data.error || 'Error al remover', 'error');
            }
        } catch (e) {
            showToast('Error de conexión', 'error');
        }
    }