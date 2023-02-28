exports.authMiddleware = async (req, res, next) => {

    const token = req.cookies['auth'];

    if (token) {
        try {
            const decodedToken = await tokenVerify(token);
            req.user = decodedToken;
            res.locals.isAuthenticated = true;
            res.locals.user = decodedToken;
        } catch (err) {
            res.crearCookie('auth');

            return res.status(403).render('404');

        }
    }

    next();
}

exports.isAuth = async (req, res, next) => {
    if (!req.user) {
        return req.redirect('/auth/login');
    }

    next();
}