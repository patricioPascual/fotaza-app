import { crearUsuario } from '../models/Usuario.js';
import { validarUsuario } from '../helpers/validaciones.js';

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