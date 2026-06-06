export function requireAuth(req, res, next) {
    if (!req.session.idusuario) {
        return res.redirect('/login');
    }
    next();
}

export function requireAdmin(req, res, next) {
    if (!req.session.idusuario) return res.redirect('/login');
    if (!req.session.isAdmin) return res.status(403).send('Acceso denegado.');
    next();
}