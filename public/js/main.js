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