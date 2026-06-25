
import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js'
import { Etiqueta } from '../models/Etiqueta.js';
import { calcularPromedioPorFoto , usuarioYaVoto} from './valoracionController.js';
import { aplicarMarcaAgua } from './fotoController.js';
import sequelize from '../db.js';

const condicionActiva = { bajada: false };

export async function crearPublicacion(req, res) {
    try {
        const { titulo, etiquetas, descripcion, imagenesBase64, copyright, marcaAgua } = req.body;
         
         if (!titulo || titulo.trim() === '') {
            return res.status(400).send('El título es obligatorio.');
        }

        if (!imagenesBase64) {
            return res.status(400).send('Debés agregar al menos una foto.');
        }
        const nuevaPub = await Publicacion.create({
            titulo,
            descripcion,
            idusuario_fk: req.session.idusuario
        });

        if (etiquetas && etiquetas.trim() != "") {
            const listaEtiquetas = etiquetas.split(/[\s,]+/).filter(tag => tag.trim() !== "");
            for (const nombre of listaEtiquetas) {
                const [etiquetaInst] = await Etiqueta.findOrCreate({
                    where: { nombre: nombre.toLowerCase().trim() }
                });
                await nuevaPub.addEtiqueta(etiquetaInst);
            }
        }

        if (imagenesBase64) {
            const arrayImgs = Array.isArray(imagenesBase64) ? imagenesBase64 : [imagenesBase64];
            const arrayCopyright = Array.isArray(copyright) ? copyright : [copyright];
            const arrayMarca = Array.isArray(marcaAgua) ? marcaAgua : [marcaAgua];

            for (let i = 0; i < arrayImgs.length; i++) {
                const partes = arrayImgs[i].split(';base64,');
                const datosPuros = partes[1];
                let buffer = Buffer.from(datosPuros, 'base64');

                const tieneCopyright = arrayCopyright[i] === 'true';
                const textoMarca = arrayMarca[i] || '';

                if (tieneCopyright && textoMarca.trim() !== '') {
                    buffer = await aplicarMarcaAgua(buffer, textoMarca);
                }

                await Foto.create({
                    archivo: buffer,
                    idpublicacion_fk: nuevaPub.idpublicacion,
                    copyright: tieneCopyright,
                    marcaAgua: tieneCopyright ? textoMarca : null
                });
            }
        }

        console.log("Publicacion y fotos guardadas.");
        res.redirect('/index');

    } catch (error) {
        console.error("ERROR AL GUARDAR:", error);
        res.status(500).send("Error al guardar en la base de datos");
    }
}
export async function traerAllPublicaciones(req, res) {
    try {
        const idusuarioLoggeado = req.session.idusuario;

        const publicaciones = await Publicacion.findAll({
            where: condicionActiva,
            include: [
                { model: Foto },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        for (const pub of publicaciones) {
            for (const foto of pub.fotos) {
                const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
                foto.dataValues.promedio = promedio;
                foto.dataValues.cantidadVotos = cantidadVotos;
                foto.dataValues.yaVoto = await usuarioYaVoto(foto.idfoto, idusuarioLoggeado);
                foto.dataValues.esMia = pub.idusuario_fk === idusuarioLoggeado;
                
            }
        }

        res.render('index', { publicaciones });
    } catch (error) {
        console.log("error cargando publicaciones", error);
        res.status(500).send("Error al cargar el muro");
    }
}

export async function traerPublicacionesDeSeguidos(req, res) {
    try {
        const idusuarioLoggeado = req.session.idusuario;

        const usuario = await Usuario.findByPk(idusuarioLoggeado);
        const seguidos = await usuario.getSeguidos();

        if (seguidos.length === 0) {
            return res.render('siguiendo', { publicaciones: [], sinSeguidos: true });
        }

        const idsSeguidos = seguidos.map(u => u.idusuario);

        const publicaciones = await Publicacion.findAll({
            where: { 
                idusuario_fk: idsSeguidos,
                bajada: false
            },
            include: [
                { model: Foto },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        for (const pub of publicaciones) {
            for (const foto of pub.fotos) {
                const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
                foto.dataValues.promedio = promedio;
                foto.dataValues.cantidadVotos = cantidadVotos;
                foto.dataValues.yaVoto = await usuarioYaVoto(foto.idfoto, idusuarioLoggeado);
                foto.dataValues.esMia = pub.idusuario_fk === idusuarioLoggeado;
            }
        }

        res.render('siguiendo', { publicaciones, sinSeguidos: false });
    } catch (error) {
        console.log("error cargando publicaciones de seguidos", error);
        res.status(500).send("Error al cargar el feed");
    }
}

//anonimos 
export async function traerPublicacionesPublicas(req, res) {
    try {
        const publicaciones = await Publicacion.findAll({
            where: { bajada: false },
            include: [
                { 
                    model: Foto,
                    where: { copyright: false },
                    required: true
                },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        for (const pub of publicaciones) {
            for (const foto of pub.fotos) {
                const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
                foto.dataValues.promedio = promedio;
                foto.dataValues.cantidadVotos = cantidadVotos;
            }
        }

        res.render('publico', { publicaciones });
    } catch (error) {
        console.log("error cargando publicaciones públicas", error);
        res.status(500).send("Error al cargar el contenido público");
    }
} 

//PRUEBA EDICION 
    export async function editarPublicacion(req, res) {
    try {
        const { idpublicacion } = req.params;
        const { titulo, descripcion, etiquetas } = req.body;
        const idusuario = req.session.idusuario;

        const pub = await Publicacion.findByPk(idpublicacion);
        if (!pub) return res.status(404).send('Publicación no encontrada.');
        if (pub.idusuario_fk !== idusuario) return res.status(403).send('No tenés permiso.');
        if (pub.enRevision || pub.bajada) return res.status(403).send('No podés editar una publicación denunciada.');

        // 1. Actualizo datos basico
        await pub.update({ titulo, descripcion });

        // 2. Actualizo etiquetas manualmente en tabla intermedia
        // Use el nombre real de la tabla en la DB
        const TablaIntermedia = sequelize.models.publicacion_etiqueta;

        // Borro todas las relaciones actuales de esta publicacion
        await TablaIntermedia.destroy({
            where: { idpublicacion_fk: idpublicacion }
        });

        // Si hay nuevas etiquetas, las proceso e inserto
        if (etiquetas && etiquetas.trim() !== '') {
            const listaEtiquetas = etiquetas.split(/[\s,]+/).filter(t => t.trim() !== '');
            
            for (const nombre of listaEtiquetas) {
                const [etiquetaInst] = await Etiqueta.findOrCreate({ 
                    where: { nombre: nombre.toLowerCase().trim() } 
                });

                // Inserto la relación manualmente
                await TablaIntermedia.create({
                    idpublicacion_fk: idpublicacion,
                    idetiqueta_fk: etiquetaInst.idetiqueta 
                });
            }
        }

        res.redirect('/index');
    } catch (error) {
        console.error('Error al editar:', error);
        res.status(500).send('Error al editar la publicación.');
    }
}

export async function eliminarPublicacion(req, res) {
    try {
        const { idpublicacion } = req.params;
        const idusuario = req.session.idusuario;

        const pub = await Publicacion.findByPk(idpublicacion);
        if (!pub) return res.status(404).send('Publicación no encontrada.');
        if (pub.idusuario_fk !== idusuario) return res.status(403).send('No tenés permiso.');
        if (pub.enRevision || pub.bajada) return res.status(403).send('No podés eliminar una publicación denunciada.');
        
        //borro etiquetas de tabla intermedia
        await sequelize.models.publicacion_etiqueta.destroy({
            where: { idpublicacion_fk: idpublicacion }
        });
        await pub.destroy();
        res.redirect('/index');
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).send('Error al eliminar la publicación.');
    }
}