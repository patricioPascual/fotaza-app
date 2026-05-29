async function abrirComentarios(idfoto, imagenBase64, promedio, cantidadVotos, yaVoto, esMia) {
    document.getElementById('idfotoModal').value = idfoto;
    document.getElementById('modalComentarios').style.display = 'flex';
    document.getElementById('imagenModal').src = `data:image/jpeg;base64,${imagenBase64}`;
    document.getElementById('modalPromedio').textContent = `⭐ ${promedio ? parseFloat(promedio).toFixed(1) : '0'}`;
    document.getElementById('modalVotos').textContent = `(${cantidadVotos || 0} votos)`;

    const seccionVotar = document.getElementById('seccionVotar');
    const mensajeVoto = document.getElementById('mensajeVoto');

    if (esMia) {
        seccionVotar.style.display = 'none';
        mensajeVoto.textContent = 'Es tu foto';
        mensajeVoto.style.display = 'block';
    } else if (yaVoto) {
        seccionVotar.style.display = 'none';
        mensajeVoto.textContent = '✔ Ya votaste esta foto';
        mensajeVoto.style.display = 'block';
    } else {
        seccionVotar.style.display = 'flex';
        mensajeVoto.style.display = 'none';
    }

    const formComentario = document.getElementById('formComentario');
    const btnCerrar = document.getElementById('btnCerrarComentarios');
    const msgCerrado = document.getElementById('comentariosCerradosMsg');

    
    const estadoRes = await fetch(`/fotos/${idfoto}/estado`);
    const { comentariosCerrados } = await estadoRes.json();

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
                html += `<div class="comentario-item">
                    <strong>${c.usuario?.nombre || 'Usuario'}</strong>
                    <p class="comentario-texto">${c.texto}</p>
                    <small class="comentario-fecha">${new Date(c.createdAt).toLocaleDateString()}</small>
                </div>`;
            }
            lista.innerHTML = html;
        }
    } catch (e) {
        lista.innerHTML = '<p class="comentario-error">Error al cargar comentarios.</p>';
    }
}

function cerrarComentarios() {
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
        abrirComentarios(id);
    } catch (e) {
        alert('Error al enviar el comentario.');
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
        alert('Error al procesar.');
    }
}