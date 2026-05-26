import express from 'express';
import sequelize from './db.js'; 
import './sync.js';
import 'dotenv/config';
import usuarioRouter from './routes/usuario.js'
import publicacionRouter from './routes/publicacion.js';
import comentarioRoutes from './routes/comentario.js';
import explorarRouter from './routes/explorar.js';
import perfilRoutes from './routes/perfil.js'
import valoracionRouter from './routes/valoracion.js'
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// MIDDELWARE DE SESION ; SACAR DESPEUS!!!!! 
app.use((req, res, next) => {
    req.session = { idusuario: 1, nombre: 'JackSparrow' };
    console.log("Middleware de sesión ejecutado, req.session es:", req.session);
    next();
});




app.use('/', valoracionRouter);
app.use('/perfil', perfilRoutes);
app.use('/explorar', explorarRouter);
app.use('/comentarios', comentarioRoutes);
app.use('/', usuarioRouter);
app.use('/', publicacionRouter);

app.get('/registro', (req, res) => {
  res.render('registro')
})

app.get('/login', (req, res) => {
  res.render('login');
})

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(' Servidor y DB listos');
    });
  })
  .catch((err) => { 
    console.error('Error de sync:', err);
  });
