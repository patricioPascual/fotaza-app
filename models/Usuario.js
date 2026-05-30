import {Model,DataTypes} from 'sequelize' 
import sequelize from '../db.js'  
import bcrypt from 'bcrypt';


export class Usuario extends Model{
   async verificarPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}


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
    hooks: {
            beforeSave: async (usuario) => {
                if (!usuario.password) return;
                if (!usuario.changed('password')) return;
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
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
 
