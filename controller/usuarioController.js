import { crearUsuario } from '../models/Usuario.js';
import { validarUsuario } from '../helpers/validaciones.js';
import { Usuario } from '../models/Usuario.js';
import { buscarPublicacionesPorUsuario } from './publicacionController.js';
import { calcularPromedioPorFoto,usuarioYaVoto } from './valoracionController.js';


export async function registrarUsuario(req, res) {
    const { nombre, email, password ,password2} = req.body;
   
   
    const validacion = validarUsuario({ nombre, email, password ,password2});

    if (validacion.success === false) {
    
        const erroresPorCampo = validacion.error.flatten().fieldErrors;

       
        return res.status(400).render('registro', { 
            errores: erroresPorCampo,
            datos: { nombre, email },  
            alert: { status: 'error', text: "Por favor, corrige los errores en el formulario." } 
        });
    }

   
    try {
        await crearUsuario(nombre, email, password);
        
        return res.render('login', {
            alert: { status: 'success', text: '¡Usuario creado con exito ! ' }
        });

    } catch (error) {
       
        let errorEmail={} 
        let msjError = "Hubo un problema en el servidor.";
        if (error.name === 'SequelizeUniqueConstraintError') {
            msjError="Este correo ya está registrado."
            errorEmail= {
                email:["Este correo ya está registrado."]};
        }

        return res.status(500).render('registro', {
            errores:errorEmail ,
            datos:{nombre,email},

            alert: { status: 'error', text: msjError }
        });
    }
}

export async function autenticarUsuario(req,res){
    const {email,password}=req.body;

    if(!email||!password){
        return res.render('login',{
            alert:{status:'error' ,text:"por favor complete los campos "},
            errores:{email:["el campo es obligatorio"], password:["el campo es obligatorio"]},
            datos:{email}
        });
    }
    try{
     const usuario= await Usuario.findOne({where:{email}});
      
     if(!usuario){
        return res.render('login',{
            alert:{status:'error' ,text:"el usuario no existe"},
            errores:{email:["el usuario no existe"]},
            datos:{email}
        });
     }
      if (usuario.password != password ){
        return res.render('login',{
            alert:{status:'error' , text:"Contraseña Incorretca"},
            errores:{password:["Contrseña incorrecta"]},
            datos:{email}
        })
      }
      res.redirect('/index')
    }catch(error){
        console.log('error al ingresar',error)

        return res.render('login', {
            alert:{status:"error", text:"error n el servidor"},
            errores:{},
            datos:{email}
        })
    }
}


export async function verPerfil(req, res) {
    try {
        const idUsuario = req.session.idusuario;
        const usuario = await Usuario.findByPk(idUsuario);

        if (!usuario) return res.status(404).send("Usuario no encontrado");

        const publicaciones = await buscarPublicacionesPorUsuario(usuario.nombre);

        for (const pub of publicaciones) {
            for (const foto of pub.fotos) { 
                const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
                
                foto.dataValues.promedio = promedio;
                foto.dataValues.cantidadVotos = cantidadVotos;
                foto.dataValues.yaVoto = await usuarioYaVoto(foto.idfoto, idUsuario);
                foto.dataValues.esMia = (pub.idusuario_fk === idUsuario);
            }
        }

        res.render('perfil', { 
            usuario: usuario.toJSON(), 
            publicaciones 
        }); 
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        res.status(500).send("Error al cargar perfil");
    }
}