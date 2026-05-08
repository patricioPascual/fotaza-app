import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Etiqueta extends Model {}

Etiqueta.init({
    idetiqueta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true 
    }
}, { 
    sequelize, 
    modelName: 'etiqueta', 
    tableName: 'etiqueta',
    freezeTableName: true,
    timestamps: false // Usualmente las etiquetas no necesitan createdAt/updatedAt
});