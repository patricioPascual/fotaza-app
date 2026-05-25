async function valorar(puntos) {
    const idFoto = document.getElementById('idfotoModal').value;
    
    try {
        const response = await fetch('/valorar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idFoto, puntaje: puntos })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error:", error);
    }
}