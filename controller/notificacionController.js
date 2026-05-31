import { Notificacion } from '../models/Notificacion.js';
import { Foto } from '../models/Foto.js';
import { Publicacion } from '../models/Publicacion.js';
import { Usuario } from '../models/Usuario.js';

export async function expresarInteres(req, res) {
    try {
        const { idfoto } = req.params;
        const idusuarioEmisor = req.session.idusuario;

        
        const foto = await Foto.findByPk(idfoto, {
            include: [{ model: Publicacion }]
        });

        if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

        const idusuarioReceptor = foto.publicacion.idusuario_fk;

        if (idusuarioEmisor === idusuarioReceptor) {
            return res.status(403).json({ error: 'No podés expresar interés en tu propia foto' });
        }

        await Notificacion.create({
            tipo: 'interes',
            idreferencia: idfoto,
            idusuarioem_fk: idusuarioEmisor,
            idusuariorec_fk: idusuarioReceptor
        });

        res.json({ ok: true });
    } catch (error) {
        console.error('Error al expresar interés:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getNotificaciones(req, res) {
    try {
        const idusuario = req.session.idusuario;

        const notificaciones = await Notificacion.findAll({
            where: { idusuariorec_fk: idusuario },
            include: [{ model: Usuario, as: 'Emisor', attributes: ['nombre'] }],
            order: [['createdAt', 'DESC']]
        });

        await Notificacion.update(
            { leido: true },
            { where: { idusuariorec_fk: idusuario, leido: false } }
        );

        res.render('notificaciones', { notificaciones });
    } catch (error) {
        res.status(500).send('Error al cargar notificaciones');
    }
}
export async function crearNotificacion(tipo, idusuarioEmisor, idusuarioReceptor, idreferencia) {
    if (idusuarioEmisor === idusuarioReceptor) return;
    await Notificacion.create({
        tipo,
        idreferencia,
        idusuarioem_fk: idusuarioEmisor,
        idusuariorec_fk: idusuarioReceptor
    });
}