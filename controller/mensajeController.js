import { Op } from 'sequelize'; 
import { Mensaje } from '../models/Mensaje.js';
import { Usuario } from '../models/Usuario.js';
import { crearNotificacion } from './notificacionController.js';

export async function enviarMensaje(req, res) {
    const { texto, id_receptor,nombre_destino } = req.body;
    const id_emisor = req.session.idusuario;

    // 1. Guardar el mensaje
    const nuevoMensaje = await Mensaje.create({ 
        texto, 
        idusuariorec_fk: id_receptor, 
        idusuarioem_fk: id_emisor 
    });

    // 2. Crear la notificación para el receptor
    // Usamos el ID del mensaje como referencia para poder redirigir
    await crearNotificacion(
        'mensaje', 
        id_emisor, 
        id_receptor, 
        nuevoMensaje.idmensaje // Referencia al nuevo mensaje
    );

    res.redirect(`/mensajes/${nombre_destino}`);
}

export async function mostrarConversacion(req, res) {
    try {
        const { nombreDestino } = req.params;
        const idUsuarioLogueado = req.session.idusuario;

        // 1. Buscamos al usuario destino por su nombre
        const destino = await Usuario.findOne({ where: { nombre: nombreDestino } });
        if (!destino) return res.status(404).send('Usuario no encontrado.');

        // 2. Buscamos todos los mensajes donde somos emisores o receptores
        const mensajes = await Mensaje.findAll({
            where: {
                [Op.or]: [
                    { idusuarioem_fk: idUsuarioLogueado, idusuariorec_fk: destino.idusuario },
                    { idusuarioem_fk: destino.idusuario, idusuariorec_fk: idUsuarioLogueado }
                ]
            },
            order: [['createdAt', 'ASC']],
            include: [
                { model: Usuario, as: 'Emisor' },
                { model: Usuario, as: 'Receptor' }
            ]
        });

        // 3. Marcamos como leídos los mensajes que recibimos de este usuario
        await Mensaje.update(
            { leido: true },
            { 
                where: { 
                    idusuarioem_fk: destino.idusuario, 
                    idusuariorec_fk: idUsuarioLogueado,
                    leido: false 
                } 
            }
        );

        res.render('mensaje', { mensajes, destino, miId: idUsuarioLogueado });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar la conversación.');
    }
}