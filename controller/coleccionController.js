import { Coleccion, ColeccionPublicacion } from '../models/Coleccion.js';
import { Publicacion } from '../models/Publicacion.js';
import { Usuario } from '../models/Usuario.js';
import {Foto} from '../models/Foto.js';
import {Etiqueta} from '../models/Etiqueta.js'; 
import { Reporte } from '../models/Reporte.js';
import { calcularPromedioPorFoto, usuarioYaVoto } from './valoracionController.js';
import { enriquecerPublicaciones } from './publicacionController.js';

export async function agregarPublicacionACol(req, res) {
    try {
        const { idPublicacion, idColeccion, nuevoNombre } = req.body;
        const idUsuario = req.session.idusuario;

        let idFinalColeccion = idColeccion;

        // Si eligió "nueva", creo la coleccion primero
        if (idColeccion === 'nueva') {
            const nueva = await Coleccion.create({ 
                nombre: nuevoNombre, 
                idusuario_fk: idUsuario 
            });
            idFinalColeccion = nueva.idcoleccion;
        }


        const yaExiste = await ColeccionPublicacion.findOne({
            where: {
                idcoleccion_fk: idFinalColeccion,
                idpublicacion_fk: idPublicacion
            }
        });

        if (yaExiste) {
        
            return res.redirect('/colecciones'); 
        }

        // 2. Si no existe, procedoa insertarla
        await ColeccionPublicacion.create({
            idcoleccion_fk: idFinalColeccion,
            idpublicacion_fk: idPublicacion
        });

        res.redirect('/colecciones');

    } catch (error) {
        console.error("Error al agregar publicación a la colección:", error);
        res.status(500).send("Error al procesar la solicitud.");
    }
}
export async function listarColecciones(req, res) {
    try {
        const idUsuario = req.session.idusuario;

        
        const misColecciones = await Coleccion.findAll({
            where: { idusuario_fk: idUsuario }
        });

        
        return misColecciones; 
        
    } catch (error) {
        console.error("Error al obtener colecciones:", error);
        return [];
    }
}
export async function verMisColecciones(req, res) {
    try {
        const idUsuario = req.session.idusuario;

        const colecciones = await Coleccion.findAll({
            where: { idusuario_fk: idUsuario },
            include: [{ 
                model: Publicacion,
                include: [{ model: Foto }, { model: Usuario }, { model: Etiqueta }] 
            }]
        });

        // logica reutilizable a cada coleccion
        for (const col of colecciones) {
            await enriquecerPublicaciones(col.publicaciones, idUsuario);
        }

        res.render('colecciones', { 
            colecciones, 
            idusuarioLoggeado: idUsuario 
        });
    } catch (error) {
         console.error("Error al cargar colecciones:", error);
    res.status(500).send('Error: ' + error.message);
    }
}

export async function verDetalleColeccion(req, res) {
    try {
        const { id } = req.params;
        const idUsuario = req.session.idusuario;

        // 1. Verificar la coleccion
        const coleccion = await Coleccion.findByPk(id);
        if (!coleccion || coleccion.idusuario_fk !== idUsuario) {
            return res.redirect('/colecciones');
        }

        // 2. Busco solo los registros en la tabla intermedia
       
        const registros = await ColeccionPublicacion.findAll({
            where: { idcoleccion_fk: id }
        });

        // 3. Extraer solo los IDs de las publicaciones
        const idsPublicaciones = registros.map(r => r.idpublicacion_fk);

        // 4. Busco las publicaciones directamente en el modelo Publicacion
     
        let publicaciones = [];
        if (idsPublicaciones.length > 0) {
            publicaciones = await Publicacion.findAll({
                where: { idpublicacion: idsPublicaciones },
                include: [Foto, Usuario, Etiqueta] 
            });
        }

        //uso la funcion enriquecer
        await enriquecerPublicaciones(publicaciones, idUsuario);

        const colecciones = await Coleccion.findAll({
            where: { idusuario_fk: idUsuario }
        });

        res.render('coleccion-detalle', { 
            nombreColeccion: coleccion.nombre,
            idColeccion: coleccion.idcoleccion,
            publicaciones: publicaciones, 
            colecciones,
            idusuarioLoggeado: idUsuario 
        });

    } catch (error) {
        console.error("Error al cargar la colección:", error);
        res.status(500).send("Error al cargar la colección");
    }
}

export async function quitarPublicacionDeCol(req, res) {
    try {
        const { idColeccion, idPublicacion } = req.params;
        const idUsuario = req.session.idusuario;

        // Verifico que la coleccion pertenezca al usuario logueado (Seguridad)
        const coleccion = await Coleccion.findByPk(idColeccion);
        if (!coleccion || coleccion.idusuario_fk !== idUsuario) {
            return res.status(403).json({ error: 'No tienes permisos sobre esta colección.' });
        }

        
        await ColeccionPublicacion.destroy({
            where: {
                idcoleccion_fk: idColeccion,
                idpublicacion_fk: idPublicacion
            }
        });

        res.json({ ok: true, message: 'Publicacion removida de la coleccion.' });

    } catch (error) {
        console.error("Error al quitar publicacion de la coleccion:", error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
}

export async function eliminarColeccion(req, res) {
    try {
        const { id } = req.params;
        const idUsuario = req.session.idusuario;

       
        const coleccion = await Coleccion.findByPk(id);
        if (!coleccion || coleccion.idusuario_fk !== idUsuario) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta coleccion.' });
        }

        //  Borro primero  en la tabla intermedia 
        // para evitar registros huerfanos,por seguridad
        await ColeccionPublicacion.destroy({
            where: { idcoleccion_fk: id }
        });

        
        await coleccion.destroy();

        res.json({ ok: true, message: 'Colección eliminada correctamente.' });

    } catch (error) {
        console.error("Error al eliminar la colección:", error);
        res.status(500).json({ error: 'Error al eliminar la colección.' });
    }
}