import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Valora extends Model {}

Valora.init({
    
    idvalora: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    puntaje: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,  
            max: 5   
        }
    }
    
}, { 
    sequelize, 
    modelName: 'valora', 
    tableName: 'valora',
    freezeTableName: true,
    timestamps: true 
});