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