import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js' 

export async function subirFotoPerfil(req, res) {
    try {
       
        const { imagenBase64 } = req.body;

        if (!imagenBase64) {
            return res.status(400).send("No se recibió ninguna imagen.");
        }

        
        const partes = imagenBase64.split(';base64,');
        const datosPuros = partes.length > 1 ? partes[1] : partes[0];
        
        
        const buffer = Buffer.from(datosPuros, 'base64');

        
        const idUsuario = 1; 

       
        await Usuario.update(
            { fotoPerfil: buffer },
            { where: { idusuario: idUsuario } }
        );

        console.log("Foto de perfil actualizada.");
        res.redirect('/perfil');

    } catch (error) {
        console.error("ERROR AL GUARDAR FOTO:", error);
        res.status(500).send("Error al actualizar la foto de perfil");
    }
}