
import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js'
import { Etiqueta } from '../models/Etiqueta.js';
import { calcularPromedioPorFoto , usuarioYaVoto} from './valoracionController.js';
import { aplicarMarcaAgua } from './fotoController.js';
import sequelize from '../db.js';
import { Reporte } from '../models/Reporte.js';
import { Coleccion } from '../models/Coleccion.js';
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

        //colecciones para pasar ala vista
        const colecciones = await Coleccion.findAll({
            where: { idusuario_fk: idusuarioLoggeado }
        });

        
        const publicaciones = await Publicacion.findAll({
            where: condicionActiva,
            include: [{ model: Foto }, { model: Usuario }, { model: Etiqueta }],
            order: [['createdAt', 'DESC']]
        });

        // uso la funcion 
        await enriquecerPublicaciones(publicaciones, idusuarioLoggeado);

        
        res.render('index', { 
            publicaciones, 
            colecciones, 
            idusuarioLoggeado 
        });

    } catch (error) {
        console.error("Error cargando muro:", error);
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
            where: { idusuario_fk: idsSeguidos, bajada: false },
            include: [
                { model: Foto },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        await enriquecerPublicaciones(publicaciones, idusuarioLoggeado);

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

        const pub = await Publicacion.findByPk(idpublicacion, {
            include: [{ model: Foto }]
        });
        if (!pub) return res.status(404).send('Publicación no encontrada.');
        if (pub.idusuario_fk !== idusuario) return res.status(403).send('No tenés permiso.');
        if (pub.enRevision || pub.bajada) return res.status(403).send('No podés editar una publicación denunciada.');

        // verificar si alguna foto tiene reportes pendientes
        const idsFotos = pub.fotos.map(f => f.idfoto);
        const reportesPendientes = await Reporte.count({
            where: { tipo: 'foto', idreferencia: idsFotos, estado: 'pendiente' }
        });
        if (reportesPendientes > 0) {
            return res.status(403).send('No podés editar una publicación con denuncias pendientes.');
        }

        await pub.update({ titulo, descripcion });

        const TablaIntermedia = sequelize.models.publicacion_etiqueta;
        await TablaIntermedia.destroy({ where: { idpublicacion_fk: idpublicacion } });

        if (etiquetas && etiquetas.trim() !== '') {
            const listaEtiquetas = etiquetas.split(/[\s,]+/).filter(t => t.trim() !== '');
            for (const nombre of listaEtiquetas) {
                const [etiquetaInst] = await Etiqueta.findOrCreate({
                    where: { nombre: nombre.toLowerCase().trim() }
                });
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

        const pub = await Publicacion.findByPk(idpublicacion, {
            include: [{ model: Foto }]
        });
        if (!pub) return res.status(404).send('Publicación no encontrada.');
        if (pub.idusuario_fk !== idusuario) return res.status(403).send('No tenés permiso.');
        if (pub.enRevision || pub.bajada) return res.status(403).send('No podés eliminar una publicación denunciada.');

        // verificar si alguna foto tiene reportes pendientes
        const idsFotos = pub.fotos.map(f => f.idfoto);
        const reportesPendientes = await Reporte.count({
            where: { tipo: 'foto', idreferencia: idsFotos, estado: 'pendiente' }
        });
        if (reportesPendientes > 0) {
            return res.status(403).send('No podés eliminar una publicación con denuncias pendientes.');
        }

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
export async function enriquecerPublicaciones(publicaciones, idUsuarioLoggeado) {
    if (!publicaciones || !Array.isArray(publicaciones)) {
        return [];
    }
    for (const pub of publicaciones) {
        let sumaPromedios = 0;
        let totalVotos = 0;

        for (const foto of pub.fotos) {
            // Reportes
            const reportes = await Reporte.count({ where: { idreferencia: foto.idfoto, tipo: 'foto' } });
            foto.tieneReportes = reportes > 0;

            // Valoraciones
            const { promedio, cantidadVotos } = await calcularPromedioPorFoto(foto.idfoto);
            foto.dataValues.promedio = promedio || 0;
            foto.dataValues.cantidadVotos = cantidadVotos || 0;
            
            sumaPromedios += (promedio || 0);
            totalVotos += (cantidadVotos || 0);

            foto.dataValues.yaVoto = await usuarioYaVoto(foto.idfoto, idUsuarioLoggeado);
            foto.dataValues.esMia = pub.idusuario_fk === idUsuarioLoggeado;
        }

        // Calculo score para ordenamiento
        pub.dataValues.score = totalVotos + ((sumaPromedios / (pub.fotos.length || 1)) * 10);
    }
    
    // Ordenar 
    return publicaciones.sort((a, b) => b.dataValues.score - a.dataValues.score);
}