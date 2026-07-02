import { crearUsuario } from '../models/Usuario.js';
import { validarUsuario } from '../helpers/validaciones.js';
import { Usuario } from '../models/Usuario.js';
import { buscarPublicacionesPorUsuario } from './explorarController.js';
import { calcularPromedioPorFoto,usuarioYaVoto } from './valoracionController.js';
import { crearNotificacion } from './notificacionController.js';
import {Rol} from '../models/Rol.js';

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
       console.log("DETALLE DEL ERROR:", error); 
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

export async function autenticarUsuario(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', {
            alert: { status: 'error', text: "Por favor complete los campos" },
            errores: { email: ["el campo es obligatorio"], password: ["el campo es obligatorio"] },
            datos: { email }
        });
    }

    try {
        const usuario = await Usuario.findOne({ where: { email },include:[{model:Rol}]});

        if (!usuario) {
            return res.render('login', {
                alert: { status: 'error', text: "El usuario no existe" },
                errores: { email: ["el usuario no existe"] },
                datos: { email }
            });
        }

        const passwordValida = await usuario.verificarPassword(password);

        if (!passwordValida) {
            return res.render('login', {
                alert: { status: 'error', text: "Contraseña incorrecta" },
                errores: { password: ["Contraseña incorrecta"] },
                datos: { email }
            });
        }
       if (!usuario.estado) {
    return res.render('login', {
        alert: { status: 'error', text: "Tu cuenta está inactiva." },
        errores: {},
        datos: { email }
    });
}
        
        req.session.idusuario = usuario.idusuario;
        req.session.nombre = usuario.nombre;
        req.session.isAdmin = (usuario.rol && usuario.rol.nombre === 'Admin');
        
        res.redirect('/index');
    } catch (error) {
        console.log('error al ingresar', error);
        return res.render('login', {
            alert: { status: "error", text: "Error en el servidor" },
            errores: {},
            datos: { email }
        });
    }
}


export function logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
}



export async function verPerfil(req, res) {
    try {
        const idUsuarioLoggeado = req.session.idusuario;
        
       
        const nombreBuscado = req.params.nombreUsuario || null;
        
        let usuario;
        if (nombreBuscado) {
            usuario = await Usuario.findOne({ where: { nombre: nombreBuscado } });
        } else {
            usuario = await Usuario.findByPk(idUsuarioLoggeado);
        }

        if (!usuario) return res.status(404).send("Usuario no encontrado");

       
        const seguidores = await usuario.getSeguidores();
        const seguidos = await usuario.getSeguidos();

      
        const yaSigue = seguidores.some(s => s.idusuario === idUsuarioLoggeado);

       
        const esMiPerfil = usuario.idusuario === idUsuarioLoggeado;

        const publicaciones = await buscarPublicacionesPorUsuario(usuario.nombre);

        for (const pub of publicaciones) {
            for (const foto of pub.fotos) {
                const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
                foto.dataValues.promedio = promedio;
                foto.dataValues.cantidadVotos = cantidadVotos;
                foto.dataValues.yaVoto = await usuarioYaVoto(foto.idfoto, idUsuarioLoggeado);
                foto.dataValues.esMia = pub.idusuario_fk === idUsuarioLoggeado;
            }
        }

        res.render('perfil', {
            usuario: usuario.toJSON(),
            publicaciones,
            seguidores: seguidores.length,
            seguidos: seguidos.length,
            esMiPerfil,
            yaSigue
        });
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        res.status(500).send("Error al cargar perfil");
    }
}


//SEGTUIMIENTO

export async function seguirUsuario(req, res) {
    try {
        const idSeguidor = req.session.idusuario;
        const { nombreUsuario } = req.params;

        const usuarioASeguir = await Usuario.findOne({ where: { nombre: nombreUsuario } });
        if (!usuarioASeguir) return res.status(404).json({ error: 'Usuario no encontrado' });

        await usuarioASeguir.addSeguidores(idSeguidor);

        
        await crearNotificacion(
            'seguimiento',
            idSeguidor,
            usuarioASeguir.idusuario,
            idSeguidor
        );

        res.json({ ok: true, accion: 'siguiendo' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function dejarDeSeguir(req, res) {
    try {
        const idSeguidor = req.session.idusuario;
        const { nombreUsuario } = req.params;

        const usuarioASeguir = await Usuario.findOne({ where: { nombre: nombreUsuario } });
        if (!usuarioASeguir) return res.status(404).json({ error: 'Usuario no encontrado' });

        await usuarioASeguir.removeSeguidores(idSeguidor);
        res.json({ ok: true, accion: 'dejando de seguir' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

