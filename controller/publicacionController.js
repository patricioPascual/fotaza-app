
import { Publicacion } from '../models/Publicacion.js'; 
import { Foto } from '../models/Foto.js';
import { Usuario } from '../models/Usuario.js'
import { Etiqueta } from '../models/Etiqueta.js';

export async function crearPublicacion (req, res)  {
    try {
        const { titulo, etiquetas, imagenesBase64 } = req.body;
         
        
        const nuevaPub = await Publicacion.create({ 
            titulo,
            idusuario_fk: 1 // ID de PRUEBA
        });
         if(etiquetas && etiquetas.trim() !=""){
            const listaEtiquetas = etiquetas.split(/[\s,]+/).filter(tag => tag.trim() !== "");
             for(const nombre of listaEtiquetas){
                const [etiquetaInst]= await Etiqueta.findOrCreate({
                    where:{nombre: nombre.toLowerCase().trim()}
                });
                await nuevaPub.addEtiqueta(etiquetaInst);
             }
         }
        if (imagenesBase64) {
            const arrayImgs = Array.isArray(imagenesBase64) ? imagenesBase64 : [imagenesBase64];

            for (const imgStr of arrayImgs) {
                const partes = imgStr.split(';base64,');
                const datosPuros = partes[1];
                const buffer = Buffer.from(datosPuros, 'base64');

              
                await Foto.create({
                    archivo: buffer,
                    idpublicacion_fk: nuevaPub.idpublicacion 
                });
            }
        }

        console.log(" Publicacion y fotos guardadas.");
        res.redirect('/index');

    } catch (error) {
        console.error("ERROR AL GUARDAR:", error);
        res.status(500).send("Error al guardar en la base de datos");
    }
};


export async function traerAllPublicaciones(req,res) {
    try{
        const publicaciones= await Publicacion.findAll({
            include:[
                {model:Foto},
                {model:Usuario},
                {model:Etiqueta}
            ],
           
            order:[['createdAt','DESC']]
                           
        });
       
        res.render('index', {publicaciones});
       
    }catch(error){
        console.log("error cargando publicaciones",error);
        res.status(500).send("Error al cargar el muro");
    }
    
}
export async function traerPublicacionesByTag(req, res) {
    try {
        const { etiqueta } = req.params; 

        const publicaciones = await Publicacion.findAll({
            include: [
                { model: Foto },
                { model: Usuario },
                { 
                    model: Etiqueta,
                    where: { nombre: etiqueta }
                     
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.render('index', { publicaciones });
    } catch (error) {
        console.log("Error cargando publicaciones por tag:", error);
        res.status(500).send("Error al cargar el muro");
    }
}
export async function traerPublicacionesByUser(req,res) {
    try{
        const {nombreUsuario}=req.params;
        const publicaciones= await Publicacion.findAll({
           
            include:[
                {model:Foto},
                {model:Usuario ,
                    where:{nombre:nombreUsuario}
                },
                {model:Etiqueta}
            ],
           
            order:[['createdAt','DESC']]
                           
        });
       
        res.render('index', {publicaciones});
       
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

    if (tipoBusqueda === 'usuario') {
        res.redirect(`/explorar/usuario/${criterio}`);
    } else {
        res.redirect(`/explorar/etiqueta/${criterio}`);
    }
}