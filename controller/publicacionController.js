
import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js'
import { Etiqueta } from '../models/Etiqueta.js';
import { calcularPromedioPorFoto , usuarioYaVoto} from './valoracionController.js';
import { aplicarMarcaAgua } from './fotoController.js';

const condicionActiva = { bajada: false };

export async function crearPublicacion(req, res) {
    try {
        const { titulo, etiquetas, descripcion, imagenesBase64, copyright, marcaAgua } = req.body;

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