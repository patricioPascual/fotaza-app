import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Foto extends Model {}

Foto.init({
    idfoto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    archivo: {
        type: DataTypes.BLOB(),
        allowNull: false
    },
    marcaAgua: DataTypes.STRING,
    copyright: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, 
    modelName: 'foto',
     tableName: 'foto',
     freezeTableName: true,
    timestamps: true,  
     paranoid: true,
    });