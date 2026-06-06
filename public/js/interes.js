async function expresarInteres() {
    const idfoto = document.getElementById('idfotoModal').value;
    try {
        const res = await fetch(`/fotos/${idfoto}/interes`, { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            showToast('¡Interés expresado! El autor será notificado.', 'success');
            document.getElementById('btnInteres').style.display = 'none';
        } else {
            showToast(data.error, 'error');
        }
    } catch (e) {
        showToast('Error al expresar interés.', 'error');
    }
}