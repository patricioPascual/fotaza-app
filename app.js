import express from 'express';
import sequelize from './db.js'; 
import './sync.js';
import 'dotenv/config';
import usuarioRouter from './routes/usuario.js'
import publicacionRouter from './routes/publicacion.js';

const app = express();
const PORT = process.env.PORT || 3000;



app.set('view engine', 'pug');
app.set('views', './views');



app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/registro',(req,res)=>{
  res.render('registro')
})
app.get('/index',(req,res)=>{
  res.render(('index'))
})
app.get('/login',(req,res)=>{
  res.render('login');
})

app.use('/', usuarioRouter);
app.use('/',publicacionRouter);
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(' Servidor y DB listos');
    });
  })
  .catch((err) => { 
    console.error('Error de sync:', err);
  });


