import { Foto } from "../models/Foto.js";
import { Valora } from "../models/Valora.js";
import sequelize from '../db.js';


export async function valorarFoto(req, res) {
    try {
        const { idFoto, puntaje } = req.body; 
        const idUsuario = 3; 
        
        
        const foto = await Foto.findByPk(idFoto);
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