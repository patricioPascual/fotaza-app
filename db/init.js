import '../sync.js';
import sequelize from '../db.js';

await sequelize.sync({ force: true });
console.log('Base de datos inicializada.');
process.exit(0);