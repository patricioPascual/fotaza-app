import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';


export class Comentario extends Model {}

Comentario.init({
    idcomentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
   
}, { sequelize, 
    modelName: 'comentario',
     tableName: 'comentario' ,
     freezeTableName: true,
     timestamps: true,  
     paranoid: true,
    });