function nuevaPublicacion() {
    const ventana = document.getElementById('nuevaPublicacion');
    if (ventana) ventana.style.display = 'flex';
}

function cerrarNuevaPublicacion() {
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

            archivos.forEach((archivo, index) => {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const base64Data = reader.result;
                    const fotoId = Date.now() + index;

                    // textarea oculto con la imagen 
                    const txtArea = document.createElement('textarea');
                    txtArea.name = 'imagenesBase64';
                    txtArea.value = base64Data;
                    txtArea.style.display = 'none';
                    contenedorInputs.appendChild(txtArea);

                    // inputs ocultos para copyright y marcaAgua
                    const inputCopyright = document.createElement('input');
                    inputCopyright.type = 'hidden';
                    inputCopyright.name = 'copyright';
                    inputCopyright.value = 'false';
                    inputCopyright.id = `copyright-${fotoId}`;
                    contenedorInputs.appendChild(inputCopyright);

                    const inputMarca = document.createElement('input');
                    inputMarca.type = 'hidden';
                    inputMarca.name = 'marcaAgua';
                    inputMarca.value = '';
                    inputMarca.id = `marca-${fotoId}`;
                    contenedorInputs.appendChild(inputMarca);

                    //preview
                    const img = document.createElement('img');
                    img.src = base64Data;
                    img.style.width = '80px';
                    img.style.height = '80px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '5px';
                    img.style.margin = '5px';

                   
                    const contenedorFoto = document.createElement('div');
                    contenedorFoto.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:5px; margin:5px;';
                    contenedorFoto.appendChild(img);

                    const selectDiv = document.createElement('div');
                    selectDiv.style.cssText = 'display:flex; gap:10px; font-size:0.85rem;';

                    const labelSin = document.createElement('label');
                    labelSin.style.cursor = 'pointer';
                    const radioSin = document.createElement('input');
                    radioSin.type = 'radio';
                    radioSin.name = `licencia-${fotoId}`;
                    radioSin.checked = true;
                    radioSin.addEventListener('change', () => {
                        document.getElementById(`copyright-${fotoId}`).value = 'false';
                        document.getElementById(`marca-${fotoId}`).value = '';
                        document.getElementById(`inputMarca-${fotoId}`).style.display = 'none';
                    });
                    labelSin.appendChild(radioSin);
                    labelSin.append(' Sin copyright');

                    const labelCon = document.createElement('label');
                    labelCon.style.cursor = 'pointer';
                    const radioCon = document.createElement('input');
                    radioCon.type = 'radio';
                    radioCon.name = `licencia-${fotoId}`;
                    radioCon.addEventListener('change', () => {
                        document.getElementById(`copyright-${fotoId}`).value = 'true';
                        document.getElementById(`inputMarca-${fotoId}`).style.display = 'block';
                    });
                    labelCon.appendChild(radioCon);
                    labelCon.append(' Con copyright');

                    selectDiv.appendChild(labelSin);
                    selectDiv.appendChild(labelCon);
                    contenedorFoto.appendChild(selectDiv);

                    const inputTextoMarca = document.createElement('input');
                    inputTextoMarca.type = 'text';
                    inputTextoMarca.id = `inputMarca-${fotoId}`;
                    inputTextoMarca.placeholder = '© Tu nombre...';
                    inputTextoMarca.style.cssText = 'display:none; width:100%; padding:4px; border-radius:5px; border:1px solid #ddd; font-size:0.8rem;';
                    inputTextoMarca.addEventListener('input', () => {
                        document.getElementById(`marca-${fotoId}`).value = inputTextoMarca.value;
                    });
                    contenedorFoto.appendChild(inputTextoMarca);

                    previsualizacion.appendChild(contenedorFoto);
                };

                reader.readAsDataURL(archivo);
            });
        });
    }
});