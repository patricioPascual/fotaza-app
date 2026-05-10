import { validarUsuario, 
          crearUsuario
           } from '../models/Usuario.js'; 


 export async function registrarUsuario(req,res){
       const body=req.body;
       const{nombre,email,password}=body;
      console.log("DATOS RECIBIDOS:", { nombre, email, password });

       const validacion= validarUsuario({
        nombre: nombre,
        email: email,
        password:password
       })

       if(validacion.success === false){

        const erroresPorCampo = validacion.error.flatten().fieldErrors;

        const nombreError= erroresPorCampo.nombre;
        const emailError= erroresPorCampo.email;
        const passwordError= erroresPorCampo.password; 
        let msj='';
         if(nombreError){
            for(const e of nombreError){
                msj +=' '+ e
            }
         } if(emailError){
            for(const e of emailError){
                msj +=' '+ e
            }
       } if(passwordError){
            for(const e of passwordError){
                msj +=' '+ e
            }
 }                      //todavia no hice hecha registro error
  res.status(400).render('registro/error', { msj: msj, alert: { status: 'error', text: "No se pudo crear el usuario!" } })
    return    
}
try{
    const nuevoUsuario={
        nombre:nombre,
        email:email,
        password:password
    }

    await crearUsuario(nombre,email,password);
return res.render('registro', {
        alert: {
            status: 'success',
            text: '¡Usuario creado! Ya podés ir al login.'
        }
    });
}catch(error){
  
    console.log('Error al guardar');
    
    
    return res.status(500).render('registro');

}
}