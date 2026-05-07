import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Publicacion extends Model {}

Publicacion.init({
    idpublicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: DataTypes.TEXT,
    comentarioserrados: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
    },
    
}, { sequelize, modelName: 'publicacion',
     tableName: 'publicacion' ,
     freezeTableName: true,
     timestamps: true,  
     paranoid: true
    });