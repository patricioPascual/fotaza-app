export function requireAuth(req, res, next) {
    if (!req.session.idusuario) {
        return res.redirect('/login');
    }
    next();
}