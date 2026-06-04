import { Reporte } from '../models/Reporte.js';
import { Foto } from '../models/Foto.js';
import { Comentario } from '../models/Comentario.js';
import { Publicacion } from '../models/Publicacion.js';
import { Usuario } from '../models/Usuario.js';

export async function crearReporte(req, res) {
    try {
        const { tipo, idreferencia, motivo, descripcion } = req.body;
        const idusuario_fk = req.session.idusuario;

        if (!tipo || !idreferencia || !motivo) {
            return res.status(400).json({ error: 'Faltan datos requeridos.' });
        }

   //verico que no haya reportado el mismo elemento
        const reporteExistente = await Reporte.findOne({
            where: { idusuario_fk, idreferencia, tipo }
        });
        if (reporteExistente) {
            return res.status(403).json({ error: 'Ya reportaste este contenido.' });
        }

        if (tipo === 'foto') {
            const foto = await Foto.findByPk(idreferencia, {
                include: [{ model: Publicacion }]
            });
            if (!foto) return res.status(404).json({ error: 'Foto no encontrada.' });
            if (foto.publicacion.idusuario_fk === idusuario_fk) {
                return res.status(403).json({ error: 'No podés reportar tu propia foto.' });
            }
        } else if (tipo === 'comentario') {
            const comentario = await Comentario.findByPk(idreferencia);
            if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado.' });
            if (comentario.idusuario_fk === idusuario_fk) {
                return res.status(403).json({ error: 'No podés reportar tu propio comentario.' });
            }
        }

        await Reporte.create({ tipo, idreferencia, motivo, descripcion, idusuario_fk });

        // contar reportes únicos por usuario para esta foto
        if (tipo === 'foto') {
            const cantidadReportes = await Reporte.count({
                where: { tipo: 'foto', idreferencia },
                distinct: true,
                col: 'idusuario_fk'
            });

            if (cantidadReportes >= 3) {
                // buscar la publicacion que contiene esta foto
                const foto = await Foto.findByPk(idreferencia, {
                    include: [{ model: Publicacion }]
                });
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
        const publicaciones = await Publicacion.findAll({
            where: { enRevision: true, bajada: false },
            include: [
                { model: Usuario, attributes: ['nombre'] },
                { model: Foto }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('adminRevisiones', { publicaciones });
    } catch (error) {
        res.status(500).send('Error al cargar revisiones.');
    }
}