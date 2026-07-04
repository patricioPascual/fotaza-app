import {Comentario} from '../models/Comentario.js'
import { Usuario } from '../models/Usuario.js'
import { Foto } from '../models/Foto.js';
import { crearNotificacion } from './notificacionController.js';
import { Publicacion } from '../models/Publicacion.js';
import { validarComentario } from '../helpers/validaciones.js';

export async function crearComentario(req, res) {
    try {
    
        const validacion = validarComentario({ body: req.body });

        if (!validacion.success) {
           
            const errores = validacion.error.flatten().fieldErrors;
               return res.status(400).json({ 
                error: "Por favor, corrige los errores",
                errores: errores 
            });
        }

     
        const { texto } = validacion.data.body;
        const { idfoto_fk } = req.body;

       
        const foto = await Foto.findByPk(idfoto_fk, {
            include: [{ model: Publicacion }]
        });
        
        if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

        if (foto.comentariosCerrados) {
            return res.status(403).json({ error: 'Los comentarios están cerrados.' });
        }

        await Comentario.create({
            texto: texto, 
            idfoto_fk: idfoto_fk,
            idusuario_fk: req.session.idusuario
        });

        
        await crearNotificacion(
            'comentario',
            req.session.idusuario,
            foto.publicacion.idusuario_fk,
            idfoto_fk
        );

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