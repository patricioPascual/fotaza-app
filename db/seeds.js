import sequelize from '../db.js';
import '../sync.js';
import { Usuario } from '../models/Usuario.js';
import { Publicacion } from '../models/Publicacion.js';
import { Foto } from '../models/Foto.js';
import { Etiqueta } from '../models/Etiqueta.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Archivo seeds cargado');
async function seed() {
    try {
        console.log('Iniciando seeds...');

        await Rol.create({ idrol: 1, nombre: 'admin' });
        await Rol.create({ idrol: 2, nombre: 'usuario' }); 
        // --- USUARIOS ---
        const usuario1 = await Usuario.create({
            nombre: 'AdminFotaza',
            email: 'administrador@fotaza.com',
            password: 'Admin1234',
              idrol_fk: 1,
            estado: true
        });

        const usuario2 = await Usuario.create({
            nombre: 'JackSparrow',
            email: 'jack@fotaza.com',
            password: 'Jack1234',
            idrol_fk: 2,
            estado: true
        });

        const usuario3 = await Usuario.create({
            nombre: 'AnaFotografa',
            email: 'ana@fotaza.com',
            password: 'Ana1234',
             idrol_fk: 2,
            estado: true
        });

        console.log('Usuarios creados.');

        // --- ETIQUETAS ---
        const [tagNaturaleza] = await Etiqueta.findOrCreate({ where: { nombre: 'naturaleza' } });
        const [tagViaje] = await Etiqueta.findOrCreate({ where: { nombre: 'viaje' } });
        const [tagComida] = await Etiqueta.findOrCreate({ where: { nombre: 'comida' } });
        const [tagArte] = await Etiqueta.findOrCreate({ where: { nombre: 'arte' } });

        console.log('Etiquetas creadas.');

        // --- IMAGENES ---
        const img1 = fs.readFileSync(path.join(__dirname, 'img', 'foto1.webp'));
        const img2 = fs.readFileSync(path.join(__dirname, 'img', 'foto2.webp'));
        const img3 = fs.readFileSync(path.join(__dirname, 'img', 'foto3.webp'));
        const img4 = fs.readFileSync(path.join(__dirname, 'img', 'foto4.webp'));
        // --- PUBLICACIONES USUARIO 2 ---
        const pub1 = await Publicacion.create({
            titulo: 'Atardecer en la montaña',
            descripcion: 'Un hermoso atardecer capturado en las sierras.',
            idusuario_fk: usuario2.idusuario
        });
        await pub1.addEtiqueta(tagNaturaleza);
        await pub1.addEtiqueta(tagViaje);
        await Foto.create({
            archivo: img1,
            idpublicacion_fk: pub1.idpublicacion,
            copyright: false
        });

        const pub2 = await Publicacion.create({
            titulo: 'Arte callejero',
            descripcion: 'Mural encontrado en el centro de la ciudad.',
            idusuario_fk: usuario2.idusuario
        });
        await pub2.addEtiqueta(tagArte);
        await Foto.create({
            archivo: img2,
            idpublicacion_fk: pub2.idpublicacion,
            copyright: true,
            marcaAgua: '© JackSparrow'
        });

        // --- PUBLICACIONES USUARIO 3 ---
        const pub3 = await Publicacion.create({
            titulo: 'Gastronomía local',
            descripcion: 'Las mejores empanadas de la región.',
            idusuario_fk: usuario3.idusuario
        });
        await pub3.addEtiqueta(tagComida);
        await Foto.create({
            archivo: img3,
            idpublicacion_fk: pub3.idpublicacion,
            copyright: false
        });

        const pub4 = await Publicacion.create({
            titulo: 'Paisaje serrano',
            descripcion: 'Vista desde la cima.',
            idusuario_fk: usuario3.idusuario
        });
        await pub4.addEtiqueta(tagNaturaleza);
        await Foto.create({
            archivo: img4,
            idpublicacion_fk: pub4.idpublicacion,
            copyright: false
        });

        console.log('Publicaciones y fotos creadas.');

        // --- SEGUIMIENTOS ---
        await usuario2.addSeguidores(usuario3.idusuario);
        await usuario3.addSeguidores(usuario2.idusuario);

        console.log('Seguimientos creados.');
        console.log('Seeds completados exitosamente.');
        await sequelize.close();
        process.exit(0);

    } catch (error) {
        console.error('Error en seeds:', error);
        await sequelize.close();
        process.exit(1);
    }
}

seed();