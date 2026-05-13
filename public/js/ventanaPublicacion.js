
function nuevaPublicacion() {
    const ventana = document.getElementById('nuevaPublicacion');
    if (ventana) ventana.style.display = 'flex';
}

function cerrarVentana() {
    const ventana = document.getElementById('nuevaPublicacion');
    if (ventana) ventana.style.display = 'none';
}


window.onclick = function(event) {
    const ventana = document.getElementById('nuevaPublicacion');
    if (event.target == ventana) {
        cerrarVentana();
    }
}