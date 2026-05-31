async function expresarInteres() {
    const idfoto = document.getElementById('idfotoModal').value;
    try {
        const res = await fetch(`/fotos/${idfoto}/interes`, { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            alert('¡Interés expresado! El autor será notificado.');
            document.getElementById('btnInteres').style.display = 'none';
        } else {
            alert(data.error);
        }
    } catch (e) {
        alert('Error al expresar interés.');
    }
}