import { Foto } from "../models/Foto.js";
import { Valora } from "../models/Valora.js";
import { crearNotificacion } from './notificacionController.js';
import { Publicacion } from "../models/Publicacion.js";
import sequelize from '../db.js';


export async function valorarFoto(req, res) {
    try {
        const { idFoto, puntaje } = req.body; 
        const idUsuario = req.session.idusuario; 
        
        
         const foto = await Foto.findByPk(idFoto, {
            include: [{ model: Publicacion }]
        });
        if (!foto) return res.status(404).json({ message: "La foto no existe." });

        
        const valoracionExistente = await Valora.findOne({
            where: { idusuario_fk: idUsuario, idfoto_fk: idFoto }
        });

        if (valoracionExistente) {
            return res.status(403).json({ message: "Ya has valorado esta foto." });
        }
        
        
        await Valora.create({ 
            idusuario_fk: idUsuario, 
            idfoto_fk: idFoto, 
            puntaje 
        });
        await crearNotificacion(
            'valoracion',
            idUsuario,
            foto.publicacion.idusuario_fk,
            idFoto
        );

        res.status(200).json({ message: "Valoración registrada con éxito." });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ message: "Error: " + error.message });
    }
}

export async function calcularPromedioPorFoto(idfoto) {
    const resultado = await Valora.findAll({
        where: { idfoto_fk: idfoto },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio'],
            [sequelize.fn('COUNT', sequelize.col('puntaje')), 'cantidadVotos']
        ]
    });
    return {
        promedio: resultado[0].dataValues.promedio,
        cantidadVotos: resultado[0].dataValues.cantidadVotos
    };
}
export async function usuarioYaVoto(idfoto, idusuario) {
    const voto = await Valora.findOne({
        where: { idfoto_fk: idfoto, idusuario_fk: idusuario }
    });
    return voto !== null;
}