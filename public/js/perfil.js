document.addEventListener('DOMContentLoaded', () => {
    const inputFoto = document.getElementById('input-foto');
    const fotoPerfil = document.querySelector('.foto-usuario'); 
    const formPerfil = document.getElementById('form-perfil'); 

    if (inputFoto) {
        inputFoto.addEventListener('change', function(e) {
            const archivo = e.target.files[0];
            if (!archivo) return;

            const reader = new FileReader();

            reader.onload = function(event) {
                const base64Data = reader.result;

               
                fotoPerfil.src = base64Data;

                
                let hiddenInput = document.getElementById('base64Input');
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.id = 'base64Input';
                    hiddenInput.name = 'imagenBase64'; 
                    formPerfil.appendChild(hiddenInput);
                }
                hiddenInput.value = base64Data;
                formPerfil.submit();
               console.log("enviado")
            };

            reader.readAsDataURL(archivo);
        });
    }
});