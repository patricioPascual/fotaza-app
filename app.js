import express from 'express';
import sequelize from './db.js'; 
import './sync.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;



app.set('view engine', 'pug');
app.set('views', './views');



app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/registro',(req,res)=>{
  res.render('registro')
})
app.get('/index',(req,res)=>{
  res.render(('index'))
})
app.get('/perfil',(rec,res)=>{
  res.render('perfil')
})

sequelize.sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(' Servidor y DB listos');
    });
  })
  .catch((err) => { 
    console.error('Error de sync:', err);
  });


