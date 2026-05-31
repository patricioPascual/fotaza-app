import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Notificacion extends Model {}

Notificacion.init({
    idnotificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('seguimiento', 'valoracion', 'comentario', 'mensaje', 'reporte','interes'),
        allowNull: false
    },
    leido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    idreferencia: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, { 
    sequelize, 
    modelName: 'notificacion', 
    tableName: 'notificacion',
    freezeTableName: true,
    timestamps: true 
});