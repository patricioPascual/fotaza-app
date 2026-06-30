import { Usuario } from './models/Usuario.js';
import { Publicacion } from './models/Publicacion.js';
import { Foto } from './models/Foto.js';
import { Comentario } from './models/Comentario.js';
import { Coleccion, ColeccionPublicacion } from './models/Coleccion.js';
import { Valora } from './models/Valora.js';
import { Reporte } from './models/Reporte.js';
import { Mensaje } from './models/Mensaje.js';
import {Etiqueta}  from './models/Etiqueta.js';
import{Notificacion} from './models/Notificacion.js'
import {Rol} from './models/Rol.js'

Usuario.hasMany(Publicacion, { foreignKey: 'idusuario_fk' });
Publicacion.belongsTo(Usuario, { foreignKey: 'idusuario_fk' });


Publicacion.hasMany(Foto, { foreignKey: 'idpublicacion_fk' });
Foto.belongsTo(Publicacion, { foreignKey: 'idpublicacion_fk' });


Usuario.hasMany(Comentario, { foreignKey: 'idusuario_fk' });
Comentario.belongsTo(Usuario, { foreignKey: 'idusuario_fk' });


Foto.hasMany(Comentario, { foreignKey: 'idfoto_fk' });
Comentario.belongsTo(Foto, { foreignKey: 'idfoto_fk' });


Usuario.hasMany(Coleccion, { foreignKey: 'idusuario_fk' });
Coleccion.belongsTo(Usuario, { foreignKey: 'idusuario_fk' });


Usuario.hasMany(Reporte, { foreignKey: 'idusuario_fk' });
Reporte.belongsTo(Usuario, { foreignKey: 'idusuario_fk' });



Usuario.belongsToMany(Foto, { through: Valora, foreignKey: 'idusuario_fk', otherKey: 'idfoto_fk' });
Foto.belongsToMany(Usuario, { through: Valora, foreignKey: 'idfoto_fk', otherKey: 'idusuario_fk' });

Rol.hasMany(Usuario, { foreignKey: 'idrol_fk' });
Usuario.belongsTo(Rol, { foreignKey: 'idrol_fk' });


//reporte 
Foto.hasMany(Reporte, { foreignKey: 'idreferencia', scope: { tipo: 'foto' } });
Reporte.belongsTo(Foto, { foreignKey: 'idreferencia', constraints: false });

Comentario.hasMany(Reporte, { foreignKey: 'idreferencia', scope: { tipo: 'comentario' } });
Reporte.belongsTo(Comentario, { foreignKey: 'idreferencia', constraints: false });



Coleccion.belongsToMany(Publicacion, { 
    through: ColeccionPublicacion, 
    foreignKey: 'idcoleccion_fk', 
    otherKey: 'idpublicacion_fk',
    
});
Publicacion.belongsToMany(Coleccion, { 
    through: ColeccionPublicacion, 
    foreignKey: 'idpublicacion_fk', 
    otherKey: 'idcoleccion_fk',
    

});




Usuario.belongsToMany(Usuario, { 
    as: 'Seguidores', 
    through: 'sigue', 
    foreignKey: 'idseguido_fk', 
    otherKey: 'idseguidor_fk' 
});

Usuario.belongsToMany(Usuario, { 
    as: 'Seguidos', 
    through: 'sigue', 
    foreignKey: 'idseguidor_fk', 
    otherKey: 'idseguido_fk' 
});


Usuario.hasMany(Mensaje, { as: 'MensajesEnviados', foreignKey: 'idusuarioem_fk' });
Usuario.hasMany(Mensaje, { as: 'MensajesRecibidos', foreignKey: 'idusuariorec_fk' });
Mensaje.belongsTo(Usuario, { as: 'Emisor', foreignKey: 'idusuarioem_fk' });
Mensaje.belongsTo(Usuario, { as: 'Receptor', foreignKey: 'idusuariorec_fk' });



Publicacion.belongsToMany(Etiqueta, { 
    through: 'publicacion_etiqueta', 
    foreignKey: 'idpublicacion_fk', 
    otherKey: 'idetiqueta_fk',
    timestamps: false 
});

Etiqueta.belongsToMany(Publicacion, { 
    through: 'publicacion_etiqueta', 
    foreignKey: 'idetiqueta_fk', 
    otherKey: 'idpublicacion_fk',
    timestamps: false 
});

Usuario.hasMany(Notificacion, { as: 'NotificacionesRecibidas', foreignKey: 'idusuariorec_fk' });
Notificacion.belongsTo(Usuario, { as: 'Receptor', foreignKey: 'idusuariorec_fk' });

Usuario.hasMany(Notificacion, { as: 'NotificacionesEnviadas', foreignKey: 'idusuarioem_fk' });
Notificacion.belongsTo(Usuario, { as: 'Emisor', foreignKey: 'idusuarioem_fk' });

export {
    Usuario,
    Publicacion,
    Foto,
    Comentario,
    Coleccion,
    ColeccionPublicacion,
    Valora,
    Reporte,
    Mensaje,
    Etiqueta,
    Notificacion
};