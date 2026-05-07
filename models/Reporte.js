import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Reporte extends Model {}

Reporte.init({
    idreporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'revisado', 'ignorado'),
        defaultValue: 'pendiente'
    }
}, { 
    sequelize, 
    modelName: 'reporte', 
    tableName: 'reporte',
    freezeTableName: true,
    timestamps: true,
    paranoid: true 
});