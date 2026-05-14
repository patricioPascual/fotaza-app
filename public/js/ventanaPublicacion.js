function nuevaPublicacion() {
    const ventana = document.getElementById('nuevaPublicacion');
    if (ventana) ventana.style.display = 'flex';
}

function cerrarVentana() {
    const ventana = document.getElementById('nuevaPublicacion');
    if (ventana) {
        ventana.style.display = 'none';
        
        document.getElementById('formPublicar').reset();
        document.getElementById('contenedorInputsBase64').innerHTML = '';
        document.getElementById('previsualizacion').innerHTML = '';
    }
}

window.onclick = function(event) {
    const ventana = document.getElementById('nuevaPublicacion');
    if (event.target == ventana) {
        cerrarVentana();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const inputArchivo = document.getElementById('inputArchivo');
    const contenedorInputs = document.getElementById('contenedorInputsBase64');
    const previsualizacion = document.getElementById('previsualizacion');

    if (inputArchivo) {
        inputArchivo.addEventListener('change', function(e) {
            const archivos = Array.from(e.target.files);

            archivos.forEach(archivo => {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const base64Data = event.target.result;

                    
                    const txtArea = document.createElement('textarea');
                    txtArea.name = 'imagenesBase64'; 
                    txtArea.value = base64Data;
                    txtArea.style.display = 'none'; 
                    contenedorInputs.appendChild(txtArea);

                    
                    const img = document.createElement('img');
                    img.src = base64Data;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '5px';
                    img.style.margin = '5px';
                    
                    previsualizacion.appendChild(img);
                };

                reader.readAsDataURL(archivo);
            });
        });
    }
});