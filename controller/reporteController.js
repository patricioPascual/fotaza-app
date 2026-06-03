import { Reporte } from '../models/Reporte.js';
import { Foto } from '../models/Foto.js';
import { Comentario } from '../models/Comentario.js';
import { Publicacion } from '../models/Publicacion.js';

export async function crearReporte(req, res) {
    try {
        const { tipo, idreferencia, motivo, descripcion } = req.body;
        const idusuario_fk = req.session.idusuario;

        if (!tipo || !idreferencia || !motivo) {
            return res.status(400).json({ error: 'Faltan datos requeridos.' });
        }

        // verificar que no haya reportado antes el mismo elemento
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
        res.json({ ok: true });

    } catch (error) {
        console.error('Error al crear reporte:', error);
        res.status(500).json({ error: error.message });
    }
}