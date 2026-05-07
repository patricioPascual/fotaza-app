import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Mensaje extends Model {}

Mensaje.init({
    idmensaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    leido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
}, { 
    sequelize, 
    modelName: 'mensaje', 
    tableName: 'mensaje',
    freezeTableName: true,
    timestamps: true 
});