import { Reporte } from '../models/Reporte.js';
import { validarReferencia } from '../helpers.js';

export async function crearReporte(req, res) {
    try {
        const { tipo, idreferencia, motivo, descripcion } = req.body;
        const idUsuario = req.session.idusuario;

        //  Uso el helper para verificar que el objetivo exista
        const existe = await validarReferencia(tipo, idreferencia);
        if (!existe) {
            return res.status(404).json({ error: "El objeto a reportar no existe." });
        }

        
        const nuevoReporte = await Reporte.create({
            tipo,
            idreferencia,
            motivo,
            descripcion,
            idusuario_fk: idUsuario 
        });

        res.status(201).json({ success: true, reporte: nuevoReporte });
    } catch (error) {
        console.error("Error al reportar:", error);
        res.status(500).json({ error: "Error interno al procesar el reporte." });
    }
}