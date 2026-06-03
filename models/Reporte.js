import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Reporte extends Model {}

Reporte.init({
    idreporte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('foto', 'comentario'),
        allowNull: false
    },
    idreferencia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
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