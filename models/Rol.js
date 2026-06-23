import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Rol extends Model {}

Rol.init({
    idrol: {
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
    modelName: 'rol',
    tableName: 'rol',
    freezeTableName: true,
    timestamps: false
});