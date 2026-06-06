import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js'
import { Etiqueta } from '../models/Etiqueta.js';
import { Op } from 'sequelize';

const condicionActiva = { bajada: false };

export async function traerPublicacionesByTag(req, res) {
    try {
        const { etiqueta } = req.params; 

        const publicaciones = await Publicacion.findAll({
            where: condicionActiva,
            include: [
                { model: Foto },
                { model: Usuario },
                { 
                    model: Etiqueta,
                    where: { nombre: { [Op.iLike]: `%${etiqueta}%` } }
                     
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('explorar', { publicaciones });
    } catch (error) {
        console.log("Error cargando publicaciones por tag:", error);
        res.status(500).send("Error al cargar el muro");
    }
}


export async function traerPublicacionesByUser(req,res) {
    try{
        const {nombreUsuario}=req.params;
        const publicaciones= await buscarPublicacionesPorUsuario(nombreUsuario);
       
        res.render('explorar', {publicaciones});
       
    }catch(error){
        console.log("error cargando publicaciones",error);
        res.status(500).send("Error al cargar el muro");
    }
}


export async function procesarBusqueda(req, res) {
    const { tipoBusqueda, criterio } = req.body;
    
  
    if (!criterio || criterio.trim() === "") {
        return res.redirect('/explorar');
    }
    if (tipoBusqueda === 'general') {
        return res.redirect(`/explorar/buscar?criterio=${encodeURIComponent(criterio)}`);
    } 
    if(tipoBusqueda==='combinada'){
        return res.redirect(`/explorar/combinada?criterio=${encodeURIComponent(criterio)}`);
    }
    if (tipoBusqueda === 'usuario') {
        res.redirect(`/explorar/usuario/${criterio}`);
    } else {
        res.redirect(`/explorar/etiqueta/${criterio}`);
    }
}

//AUXILIAR

export async function buscarPublicacionesPorUsuario(nombreUsuario) {
    return await Publicacion.findAll({
        where: condicionActiva,
        include: [
            { model: Foto },
            { model: Usuario, 
            where: { nombre: { [Op.iLike]: `%${nombreUsuario}%` } }
        },
            { model: Etiqueta }
        ],
        order: [['createdAt', 'DESC']]
    });
}

export async function buscarPublicacionesGeneral(req, res) {
    const { criterio } = req.query; 

    if (!criterio) return res.redirect('/explorar');

   
    const palabras = criterio.split(' ').filter(p => p.length > 0);

   
    const condicionesBusqueda = []
    for (let i = 0; i < palabras.length; i++) {
    const busqueda = `%${palabras[i]}%`;
  
         const condicion = {
            [Op.or]: [
            { '$usuario.nombre$': { [Op.iLike]: busqueda } },
            { '$etiqueta.nombre$': { [Op.iLike]: busqueda } },
            { titulo: { [Op.iLike]: busqueda } }
        ]
    };
    
    
    condicionesBusqueda.push(condicion);
}

    try {
        const publicaciones = await Publicacion.findAll({
            where: {
                [Op.and]: [
                    { bajada: false }, 
                    { [Op.or]: condicionesBusqueda } 
                ]
            },
            include: [
                { model: Foto },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('explorar', { publicaciones, criterio });
    } catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).send("Error al buscar");
    }
}

export async function busquedaCombinada(req, res) {
    const { criterio } = req.query; 

    if (!criterio || criterio.trim() === "") {
        return res.redirect('/explorar');
    }

    const palabras = criterio.split(' ').filter(p => p.length > 0);

    const condicionesAND = palabras.map(palabra => {
        const busqueda = `%${palabra}%`;
        return {
            [Op.or]: [
                { '$usuario.nombre$': { [Op.iLike]: busqueda } },
                { '$etiqueta.nombre$': { [Op.iLike]: busqueda } },
                { titulo: { [Op.iLike]: busqueda } }
            ]
        };
    });

    try {
        const publicaciones = await Publicacion.findAll({
            where: {
                [Op.and]: [
                    { bajada: false },
                    ...condicionesAND
                ]
            },
            include: [
                { model: Foto },
                { model: Usuario },
                { model: Etiqueta }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('explorar', { publicaciones, criterio });
    } catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).send("Error al cargar la búsqueda");
    }
}