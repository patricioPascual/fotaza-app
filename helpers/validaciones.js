import * as z from 'zod';
import { Foto } from '../models/Foto.js';
import { Comentario } from '../models/Comentario.js';
//validacion  

const USER = z.object({
  nombre: z.string()
    .regex(/^[a-zA-Z0-9 ]+$/, { 
      message: "El nombre no puede contener caracteres especiales" 
    })
    .min(3, "El nombre debe contener más de 3 caracteres")
    .max(40, "El nombre es demasiado largo"),
    
  email: z.string().email("Email invalido"),
  
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),

  password2: z.string()
})
  .refine((data)=> data.password=== data.password2, {
    message:"Las contraseñas no coinciden ",
    path:["password2"],
  });

// Función para usar el esquema
 export function validarUsuario(usuario) {  
  return USER.safeParse(usuario);
}

export async function validarReferencia(tipo, id) {
    
    const modelos = { 
        foto: Foto, 
        comentario: Comentario 
    };

    const Modelo = modelos[tipo];
    if (!Modelo) return null; 

    return await Modelo.findByPk(id); // Retorna el objeto o null
}