import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

export class Coleccion extends Model {}
Coleccion.init({
    idcoleccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    esfavorito: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: 'coleccion', tableName: 'coleccion', timestamps: true });

// Tabla Intermedia: coleccion_publicacion
export class ColeccionPublicacion extends Model {}
ColeccionPublicacion.init({
    fecha_guardado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { sequelize,
     modelName: 'coleccion_publicacion', 
     tableName: 'coleccion_publicacion', 
     freezeTableName: true,
     timestamps: false });