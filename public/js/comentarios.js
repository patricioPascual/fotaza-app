let fotoId, fotoImg, fotoPromedio, fotoVotos, fotoYaVoto, fotoEsMia, idDuenoFoto;

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.innerText = texto;
    return div.innerHTML;
}

async function abrirComentarios(idfoto, imagenBase64, promedio, cantidadVotos, yaVoto, esMia) {
    fotoId = idfoto;
    fotoImg = imagenBase64;
    fotoPromedio = promedio;
    fotoVotos = cantidadVotos;
    fotoYaVoto = yaVoto;
    fotoEsMia = esMia;

    document.getElementById('idfotoModal').value = idfoto;
    document.getElementById('modalComentarios').style.display = 'flex';
    document.getElementById('imagenModal').src = `data:image/jpeg;base64,${imagenBase64}`;
    document.getElementById('modalPromedio').textContent = `⭐ ${promedio ? parseFloat(promedio).toFixed(1) : '0'}`;
    document.getElementById('modalVotos').textContent = `(${cantidadVotos || 0} votos)`;

    const seccionVotar = document.getElementById('seccionVotar');
    const mensajeVoto = document.getElementById('mensajeVoto');
    const btnInteres = document.getElementById('btnInteres');

    if (esMia) {
        seccionVotar.style.display = 'none';
        mensajeVoto.textContent = 'Es tu foto';
        mensajeVoto.style.display = 'block';
        btnInteres.style.display = 'none';
    } else if (yaVoto) {
        seccionVotar.style.display = 'none';
        mensajeVoto.textContent = '✔ Ya votaste esta foto';
        mensajeVoto.style.display = 'block';
        btnInteres.style.display = 'block';
    } else {
        seccionVotar.style.display = 'flex';
        mensajeVoto.style.display = 'none';
        btnInteres.style.display = 'block';
    }

    const formComentario = document.getElementById('formComentario');
    const btnCerrar = document.getElementById('btnCerrarComentarios');
    const msgCerrado = document.getElementById('comentariosCerradosMsg');

    const estadoRes = await fetch(`/fotos/${idfoto}/estado`);
    const { comentariosCerrados, idDueno } = await estadoRes.json();
    idDuenoFoto = idDueno;

    if (comentariosCerrados) {
        formComentario.style.display = 'none';
        msgCerrado.style.display = 'block';
        btnCerrar.style.display = 'block';
        btnCerrar.textContent = '🔓 Abrir comentarios';
    } else if (esMia) {
        formComentario.style.display = 'flex';
        msgCerrado.style.display = 'none';
        btnCerrar.style.display = 'block';
        btnCerrar.textContent = '🔒 Cerrar comentarios';
    } else {
        formComentario.style.display = 'flex';
        msgCerrado.style.display = 'none';
        btnCerrar.style.display = 'none';
    }

    const lista = document.getElementById('listaComentarios');
    lista.innerHTML = '<p class="comentario-cargando">Cargando...</p>';

    try {
        const res = await fetch(`/comentarios/${idfoto}`);
        const comentarios = await res.json();

        if (comentarios.length === 0) {
            lista.innerHTML = '<p class="comentario-vacio">Sin comentarios aún. ¡Sé el primero!</p>';
        } else {
            let html = '';
            for (const c of comentarios) {
                const esComentarioDelDueno = c.idusuario_fk === idDuenoFoto;
                const esMiComentario = c.idusuario_fk === usuarioLogueadoId;

                let btnReporte = '';
                if (!esComentarioDelDueno && !esMiComentario) {
                    btnReporte = `<button class="btn-report-comentario" 
                        onclick="abrirReporte('comentario', ${c.idcomentario})">🚩 Reportar</button>`;
                }

                html += `<div class="comentario-item">
                     <strong>${escaparHTML(c.usuario?.nombre || 'Usuario')}</strong>
                    <p class="comentario-texto">${escaparHTML(c.texto)}</p>
                    <small class="comentario-fecha">${new Date(c.createdAt).toLocaleDateString()}</small>
                    ${btnReporte}
                </div>`;
            }
            lista.innerHTML = html;
        }
    } catch (e) {
        lista.innerHTML = '<p class="comentario-error">Error al cargar comentarios.</p>';
    }
}

function cerrarVentana() {
    document.getElementById('modalComentarios').style.display = 'none';
}

document.getElementById('formComentario').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('idfotoModal').value;
    const texto = this.querySelector('textarea').value;

    try {
        await fetch('/comentarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto, idfoto_fk: id })
        });
        this.querySelector('textarea').value = '';
        abrirComentarios(fotoId, fotoImg, fotoPromedio, fotoVotos, fotoYaVoto, fotoEsMia);
    } catch (e) {
        showToast('Error al enviar el comentario.', 'error');
    }
});

async function cerrarComentariosModal() {
    const id = document.getElementById('idfotoModal').value;
    const btn = document.getElementById('btnCerrarComentarios');
    const cerrar = btn.textContent.includes('Cerrar');
    const ruta = cerrar ? 'cerrarComentarios' : 'abrirComentarios';

    try {
        const res = await fetch(`/fotos/${id}/${ruta}`, { method: 'POST' });
        const data = await res.json();

        if (data.ok) {
            const formComentario = document.getElementById('formComentario');
            const msgCerrado = document.getElementById('comentariosCerradosMsg');

            if (cerrar) {
                formComentario.style.display = 'none';
                msgCerrado.style.display = 'block';
                btn.textContent = '🔓 Abrir comentarios';
            } else {
                formComentario.style.display = 'flex';
                msgCerrado.style.display = 'none';
                btn.textContent = '🔒 Cerrar comentarios';
            }
        }
    } catch (e) {
        showToast('Error al procesar.', 'error');
    }
}

function abrirReporte(tipo, idreferencia) {
    const id = idreferencia || document.getElementById('idfotoModal').value;
    document.getElementById('reporteTipo').value = tipo;
    document.getElementById('reporteIdReferencia').value = id;
    document.getElementById('modalReporte').style.display = 'flex';
}

function cerrarReporte() {
    document.getElementById('modalReporte').style.display = 'none';
}

document.getElementById('formReporte').addEventListener('submit', async (e) => {
    e.preventDefault();

    const motivo = document.getElementById('motivo').value;
    const descripcion = document.getElementById('descripcion').value;
    const tipo = document.getElementById('reporteTipo').value;
    const idreferencia = document.getElementById('reporteIdReferencia').value;

  
    if (!motivo) {
        showToast('Por favor, seleccioná un motivo.', 'error');
        return;
    }
    
    if (!descripcion.trim()) {
        showToast('Por favor, escribí una descripción.', 'error');
        return;
    }
   const data = { tipo, idreferencia, motivo, descripcion };

    try {
        const res = await fetch('/reportes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showToast('Denuncia enviada correctamente.', 'success');
            cerrarReporte();
        } else {
            showToast('Error al enviar la denuncia.', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Error de conexión.', 'error');
    }
});