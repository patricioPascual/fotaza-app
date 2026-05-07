import express from 'express';
import sequelize from './db.js'; 
import './sync.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;



sequelize.sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(' Servidor y DB listos');
    });
  })
  .catch((err) => { 
    console.error('Error de sync:', err);
  });


