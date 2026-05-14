
import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';

export async function crearPublicacion (req, res)  {
    try {
        const { titulo, etiquetas, imagenesBase64 } = req.body;

        
        const nuevaPub = await Publicacion.create({ 
            titulo, 
            etiquetas,
            idusuario_fk: 1 // ID de PRUEBA
        });

        if (imagenesBase64) {
            const arrayImgs = Array.isArray(imagenesBase64) ? imagenesBase64 : [imagenesBase64];

            for (const imgStr of arrayImgs) {
                const partes = imgStr.split(';base64,');
                const datosPuros = partes[1];
                const buffer = Buffer.from(datosPuros, 'base64');

              
                await Foto.create({
                    archivo: buffer,
                    idpublicacion_fk: nuevaPub.idpublicacion 
                });
            }
        }

        console.log(" Publicacion y fotos guardadas.");
        res.redirect('/index');

    } catch (error) {
        console.error("ERROR AL GUARDAR:", error);
        res.status(500).send("Error al guardar en la base de datos");
    }
};