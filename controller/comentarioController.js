import {Comentario} from '../models/Comentario.js'
import { Usuario } from '../models/Usuario.js'

export async function crearComentario(req, res) {
    try {
        const { texto, idfoto_fk } = req.body;
        if (!texto || texto.trim() === '') {
            return res.status(400).json({ error: 'El contenido no puede estar vacío' });
        }
        await Comentario.create({
            texto: texto.trim(),
            idfoto_fk: idfoto_fk,
            idusuario_fk: 1
        });
        res.json({ ok: true });
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
export async function getComentariosFoto(req, res) {
    try {
        
        const { idfoto } = req.params; 

        if (!idfoto) {
            return res.status(400).json({ error: 'El ID de la foto es requerido.' });
        }

        
        const comentarios = await Comentario.findAll({
            where: { 
                idfoto_fk: idfoto 
            },
            include:[{
                model: Usuario,
                attributes:['nombre']
            }],
            order: [['createdAt', 'ASC']]
        });

       
        return res.status(200).json(comentarios);

    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        return res.status(500).json({ error: 'Error interno del servidor al cargar comentarios.' });
    }
}