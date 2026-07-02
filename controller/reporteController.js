import { Reporte } from '../models/Reporte.js';
import { Foto } from '../models/Foto.js';
import { Comentario } from '../models/Comentario.js';
import { Publicacion } from '../models/Publicacion.js';
import { Usuario } from '../models/Usuario.js';
import { crearNotificacion } from './notificacionController.js';

export async function crearReporte(req, res) {
    try {
        const { tipo, idreferencia, motivo, descripcion } = req.body;
        const idusuario_fk = req.session.idusuario;

        if (!tipo || !idreferencia || !motivo) {
            return res.status(400).json({ error: 'Faltan datos requeridos.' });
        }
       

        //declaracion var glob 
        let foto = null;
        let comentario = null;
   //verico que no haya reportado el mismo elemento
        const reporteExistente = await Reporte.findOne({
            where: { idusuario_fk, idreferencia, tipo }
        });
        if (reporteExistente) {
            return res.status(403).json({ error: 'Ya reportaste este contenido.' });
        }

        if (tipo === 'foto') {
             foto = await Foto.findByPk(idreferencia, {
                include: [{ model: Publicacion }]
            });
            if (!foto) return res.status(404).json({ error: 'Foto no encontrada.' });
            if (foto.publicacion.idusuario_fk === idusuario_fk) {
                return res.status(403).json({ error: 'No podés reportar tu propia foto.' });
            }
        } else if (tipo === 'comentario') {
             comentario = await Comentario.findByPk(idreferencia);
            if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado.' });
            if (comentario.idusuario_fk === idusuario_fk) {
                return res.status(403).json({ error: 'No podés reportar tu propio comentario.' });
            }
        }

        await Reporte.create({ tipo, idreferencia, motivo, descripcion, idusuario_fk });
         //NOtificacion 
         let idUsuarioDestino;

// uso las variables que ya existes foto y comentario
if (tipo === 'foto') {
   
    idUsuarioDestino = foto.publicacion.idusuario_fk;
} else if (tipo === 'comentario') {
    
    idUsuarioDestino = comentario.idusuario_fk;
}


if (idUsuarioDestino) {
    await crearNotificacion('reporte', idusuario_fk, idUsuarioDestino, idreferencia);
}
        // contar reportes únicos por usuario para esta foto
        if (tipo === 'foto') {
            const cantidadReportes = await Reporte.count({   //para que no traiga los desestimados
                where: { tipo: 'foto', idreferencia, estado:'pendiente' },
                distinct: true,
                col: 'idusuario_fk'
            });

            if (cantidadReportes >= 3) {
                // buscar la publicacion que contiene esta foto
               /**  const foto = await Foto.findByPk(idreferencia, {
                    include: [{ model: Publicacion }]
                });*/
                await foto.publicacion.update({ enRevision: true });
            }
        }

        res.json({ ok: true });

    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function bajarPublicacion(req, res) {
    try {
        const { idpublicacion } = req.params;

        const publicacion = await Publicacion.findByPk(idpublicacion);
        if (!publicacion) return res.status(404).json({ error: 'Publicación no encontrada.' });

        await publicacion.update({ bajada: true });

        // contar publicaciones bajadas del autor
        const cantidadBajadas = await Publicacion.count({
            where: { idusuario_fk: publicacion.idusuario_fk, bajada: true }
        });

        if (cantidadBajadas >= 3) {
            await Usuario.update(
                { estado: false },
                { where: { idusuario: publicacion.idusuario_fk } }
            );
        }

        // marcar todos los reportes de esta publicacion como revisados
        const fotos = await Foto.findAll({ where: { idpublicacion_fk: idpublicacion } });
        for (const foto of fotos) {
            await Reporte.update(
                { estado: 'revisado' },
                { where: { tipo: 'foto', idreferencia: foto.idfoto } }
            );
        }

         res.redirect('/reportes/admin/revisiones');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function desestrimarReportes(req, res) {
    try {
        const { idpublicacion } = req.params;

        const fotos = await Foto.findAll({ where: { idpublicacion_fk: idpublicacion } });
        for (const foto of fotos) {
            await Reporte.update(
                { estado: 'ignorado' },
                { where: { tipo: 'foto', idreferencia: foto.idfoto } }
            );
        }

        await Publicacion.update(
            { enRevision: false },
            { where: { idpublicacion } }
        );

         res.redirect('/reportes/admin/revisiones');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export async function getPublicacionesEnRevision(req, res) {
    try {
        // traer IDs de fotos con reportes pendientes
        const fotosConReportes = await Reporte.findAll({
            where: { tipo: 'foto', estado: 'pendiente' },
            attributes: ['idreferencia'],
            group: ['idreferencia']
        });
        
        const idsFotos = fotosConReportes.map(r => r.idreferencia);
        
        if (idsFotos.length === 0) {
            return res.render('adminRevisiones', { publicaciones: [] });
        }

        // traer publicaciones que tengan esas fotos
        const publicaciones = await Publicacion.findAll({
            where: { bajada: false },
            include: [
                { model: Usuario, attributes: ['nombre'] },
                { 
                    model: Foto,
                    where: { idfoto: idsFotos },
                    required: true,
                    include: [{
                        model: Reporte,
                        where: { estado: 'pendiente', tipo: 'foto' },
                        required: false,
                        include: [{ model: Usuario, attributes: ['nombre'] }]
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        for (const pub of publicaciones) {
            let totalReportes = 0;
            for (const foto of pub.fotos) {
                totalReportes += foto.reportes ? foto.reportes.length : 0;
            }
            pub.dataValues.totalReportes = totalReportes;
        }

        res.render('adminRevisiones', { publicaciones });
    } catch (error) {
        res.status(500).send('Error al cargar revisiones: ' + error.message);
    }
} 

export async function getReportesComentariosPropios(req, res) {
    try {
        const idUsuarioLogueado = req.session.idusuario;

        const reportes = await Reporte.findAll({
            where: { tipo: 'comentario', estado: 'pendiente' },
            include: [{
                model: Comentario,
                required: true, // Obligatorio: debe existir el comentario
                include: [
                    {
                        model: Foto,
                        required: true, // Obligatorio: el comentario debe estar en una foto
                        include: [{
                            model: Publicacion,
                            required: true, // Obligatorio: la foto debe pertenecer a una publicacion TUYA
                            where: { idusuario_fk: idUsuarioLogueado }
                        }]
                    }, 
                    {
                        model: Usuario, 
                        attributes: ['nombre']
                    }
                ]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.render('misReportesComentarios', { reportes });
    } catch (error) {
        res.status(500).send('Error al cargar reportes: ' + error.message);
    }
}

export async function borrarComentarioAutor(req, res) {
    try {
        console.log("Parámetros recibidos:", req.params);
        const idParam = req.params.idComentario;
        const idusuario = req.session.idusuario;
      
        console.log("ID capturado desde params:", idParam);
        const comentario = await Comentario.findByPk(idParam, {
            include: [{ model: Foto, include: [{ model: Publicacion }] }]
        });
          if (!comentario) {
            console.error("No se encontró el comentario en la DB");
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }
        if (!comentario) return res.status(404).send('Comentario no encontrado.');
        if (comentario.foto.publicacion.idusuario_fk !== idusuario) {
            return res.status(403).send('No tenés permiso.');
        }

        await comentario.destroy();
        res.redirect('/reportes/mis-comentarios');
    } catch (error) {
        console.error("Error en borrarComentarioAutor:", error);
        res.status(500).send('Error: ' + error.message);
    }
}
export async function desestimarReporteComentario(req, res) {
    try {
        const { idcomentario } = req.params;
        await Reporte.update(
            { estado: 'ignorado' },
            { where: { tipo: 'comentario', idreferencia: idcomentario } }
        );
        res.redirect('/reportes/mis-comentarios');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}