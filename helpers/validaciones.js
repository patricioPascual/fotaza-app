import * as z from 'zod';
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


 const Comentario = z.object({
    body: z.object({
        texto: z.string()
            .trim()
            .min(1, "El comentario no puede estar vacio")
            .max(500, "Máximo 500 caracteres")
            .refine(val => !/<[^>]*>/g.test(val), {
                message: "No se permiten etiquetas HTML en los comentarios."
            })
    })
});
export function validarComentario(comentario) {  
  return Comentario.safeParse(comentario);
}