import express from 'express';
import session from 'express-session';
import sequelize from './db.js';
import './sync.js';
import 'dotenv/config';
import usuarioRouter from './routes/usuario.js';
import publicacionRouter from './routes/publicacion.js';
import comentarioRoutes from './routes/comentario.js';
import explorarRouter from './routes/explorar.js';
import perfilRoutes from './routes/perfil.js';
import valoracionRouter from './routes/valoracion.js';
import fotoRouter from './routes/foto.js';
import { requireAuth } from './middlewares/auth.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
    }
}));


app.use((req, res, next) => {
    res.locals.usuarioLoggeado = req.session.nombre || null;
    next();
});

app.get('/registro', (req, res) => res.render('registro'));
app.get('/login', (req, res) => res.render('login'));
app.use('/', usuarioRouter);

app.use('/fotos', requireAuth, fotoRouter);
app.use('/', requireAuth, valoracionRouter);
app.use('/perfil', requireAuth, perfilRoutes);
app.use('/explorar', requireAuth, explorarRouter);
app.use('/comentarios', requireAuth, comentarioRoutes);
app.use('/', requireAuth, publicacionRouter);




sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => console.log('Servidor y DB listos'));
    })
    .catch((err) => {
        console.error('Error de sync:', err);
    });