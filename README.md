# Fotaza
App web para compartir fotografías desarrollada con Node.js, Express y PostgreSQL.

## Deploy 
https://fotaza-app.onrender.com 

## USUARIOS DE PRUEBA DEPLOY  
| Usuario         | Email                    | Password     | Rol   |

| elAdmin         | admin@fotaza.com         | Admin2026   | Admin 
| Homero Simpson  | homero@simpson.com       | 12345678  | User  





### PASOS
1. Clonar el repositorio
   git clone https://github.com/patricioPascual/fotaza-app/tree/Prod
   cd fotaza

2. Instalar dependencias
   npm install

3. Configurar variables de entorno
   Copiar .env.example a .env y completar los valores

4. Inicializar la base de datos
   npm run db:init

5. Cargar datos de prueba
   npm run db:seed

6. Iniciar la aplicación
   npm start

La app queda disponible en http://localhost:3000

##USUARIOS DE SEEDS  

| Usuario       | Email                    | Password     | Rol   |

| AdminFotaza   | administrador@fotaza.com    | Admin1234 | Admin 
| JackSparrow   | jack@fotaza.com             | Jack1234  | User  
| AnaFotografa  | ana@fotaza.com              | Ana1234   | User  


## Variables de entorno
Ver .env.example para la lista completa de variables necesarias.


## Problemas encontrados y soluciones
 1Problema al hacer deploy en Vercel , ya que es serverless y no mantenia la sesion 
 solucion se realizo deploy en Render.   
 
 2. Layout roto al agregar comentarios
Al intentar agregar el formulario de comentarios dentro de las cards del muro,
el layout se rompía y la sidebar quedaba debajo del contenido.
Solución: implementar un modal  en el layout, reutilizado 
para todas las fotos, evitando modificar el flujo del muro. 

3-Problema al realizar el seed para cargar las imagenes BLOB  
 Solucion: coloque 4 imagenes en db/img  que se utilizan en el seed para 
 cargar las publicaciones de muetsra  

 
## Funcionalidades implementadas
- Sistema de autenticación con bcrypt
- Gestión de publicaciones con imágenes
- Comentarios con cierre y reportes
- Valoración de imágenes
- Seguimiento de usuarios
- Notificaciones
- Panel de administración
- Marca de agua en imágenes con copyright
- Deploy en Render con DB en Neon  

## Tecnologías

- **Node.js + Express** — plataforma principal del servidor, maneja las rutas, middlewares y lógica de negocio de la aplicación.
- **PostgreSQL + Sequelize** — base de datos relacional para persistir usuarios, publicaciones, fotos, comentarios y demás entidades. Sequelize actúa como ORM permitiendo trabajar con modelos JavaScript en lugar de SQL directo.
- **Pug** — motor de templates para renderizar las vistas HTML en el servidor.
- **Bcrypt** — encriptación de contraseñas antes de guardarlas en la base de datos, usando hash con salt para mayor seguridad.
- **Express-session** — manejo de sesiones de usuario, permite mantener al usuario autenticado entre requests.
- **Sharp** — procesamiento de imágenes en el servidor, utilizado para aplicar la marca de agua sobre las fotos con copyright antes de guardarlas en la base de datos.
- **Zod** — validación de datos en el registro de usuarios, verifica formato de email, longitud de contraseña y coincidencia de campos.

- **pg** — driver de PostgreSQL para Node.js, requerido por Sequelize para conectarse a la base de datos.
- **dotenv** — carga las variables de entorno desde el archivo `.env`, separando la configuración del código.
  