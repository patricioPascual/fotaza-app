import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js' 
import { Publicacion } from '../models/Publicacion.js';
import sharp from 'sharp';


export async function subirFotoPerfil(req, res) {
    try {
       
        const { imagenBase64 } = req.body;

        if (!imagenBase64) {
            return res.status(400).send("No se recibió ninguna imagen.");
        }

        
        const partes = imagenBase64.split(';base64,');
        const datosPuros = partes.length > 1 ? partes[1] : partes[0];
        
        
        const buffer = Buffer.from(datosPuros, 'base64');

        
        const idUsuario = req.session.idusuario; 

       
        await Usuario.update(
            { fotoPerfil: buffer },
            { where: { idusuario: idUsuario } }
        );

        
        res.redirect('/perfil');

    } catch (error) {
        console.error("ERROR AL GUARDAR FOTO:", error);
        res.status(500).send("Error al actualizar la foto de perfil");
    }
}

export async function aplicarMarcaAgua(buffer, texto) {
    const imagen = sharp(buffer);
    const { width, height } = await imagen.metadata();

    const svgMarca = `
        <svg width="${width}" height="${height}">
            <text 
                x="50%" y="90%" 
                text-anchor="middle" 
                font-size="${Math.max(20, width * 0.05)}px"
                font-family="Arial"
                fill="rgba(255,255,255,0.6)"
                stroke="rgba(0,0,0,0.4)"
                stroke-width="1"
            >${texto}</text>
        </svg>`;

    return await imagen
        .composite([{ input: Buffer.from(svgMarca), gravity: 'south' }])
        .jpeg()
        .toBuffer();
}

export async function cerrarComentarios(req, res) {
    try {
        const { idfoto } = req.params;
        const idUsuarioLoggeado = req.session.idusuario;

        const foto = await Foto.findByPk(idfoto, {
            include: [{ model: Publicacion }]
        });

        if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

        if (foto.publicacion.idusuario_fk !== idUsuarioLoggeado) {
            return res.status(403).json({ error: 'No tenés permiso para hacer esto.' });
        }

        await foto.update({ comentariosCerrados: true });
        res.json({ ok: true });
        console.log("comentarios cerrados");
    } catch (error) {
        console.log("error al cerrar comentarios")
        res.status(500).json({ error: error.message });
    }
}
export async function abrirComentarios(req, res) {
    try {
        const { idfoto } = req.params;
        const idUsuarioLoggeado = req.session.idusuario;

        const foto = await Foto.findByPk(idfoto, {
            include: [{ model: Publicacion }]
        });

        if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

        if (foto.publicacion.idusuario_fk !== idUsuarioLoggeado) {
            return res.status(403).json({ error: 'No tenés permiso.' });
        }

        await foto.update({ comentariosCerrados: false });
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getEstadoFoto(req, res) {
    try {
        const { idfoto } = req.params;
        const foto = await Foto.findByPk(idfoto, {
            attributes: ['comentariosCerrados']
        });
        if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });
        res.json({ comentariosCerrados: foto.comentariosCerrados,idDueno: foto.idusuario_fk });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}