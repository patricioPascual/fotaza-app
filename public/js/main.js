function toggleMenu() {
      const menu = document.getElementById("menu-desplegable");
      menu.classList.toggle("show");
    }

    
  function showToast(mensaje, tipo = 'success') {
    const modalAbierto = document.getElementById('modalComentarios')?.style.display === 'flex';
    const containerId = modalAbierto ? 'toast-container' : 'toast-container-global';
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

// 2. Lógica del select "nueva"
// Cambia tu función checkNueva por esta
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