import {Model,DataTypes} from 'sequelize' 
import sequelize from '../db.js'  
import * as z from 'zod';


export class Usuario extends Model{}

Usuario.init(
  {
    idusuario:{
        type:DataTypes.INTEGER(10),
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    nombre: {
      type: DataTypes.STRING(100), 
      allowNull: false,
      
    },
    email: {
      type: DataTypes.STRING(50), 
      allowNull: false,
      unique: true 
    },
    password:{
        type: DataTypes.STRING(60),
        allowNull:false
    },
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    fotoPerfil:{
        type:DataTypes.BLOB,
        allowNull:true  
    }

  },
  {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario',
    freezeTableName: true,
    timestamps: true,  
    paranoid: true,    
  }
);

export async function  crearUsuario(nombre,email,password){

     try{

      const nuevoUsuario= await Usuario.create({
        nombre,
        email:email,
        password:password,
       
      })
         return nuevoUsuario.toJSON();  
     }catch(error){
       throw error;
     }

}
//validacion  

const USER = z.object({
  nombre: z.string()
    .regex(/^[a-zA-Z0-9 ]+$/, { 
      mensaje: "El nombre no puede contener caracteres especiales" 
    })
    .min(3, "El nombre debe contener más de 3 caracteres")
    .max(40, "El nombre es demasiado largo"),
    
  email: z.string().email("Email invalido"),
  
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

// Función para usar el esquema
 export function validarUsuario(usuario) {
  return USER.safeParse(usuario);
}
 

