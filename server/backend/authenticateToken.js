const jwt = require('jsonwebtoken');
const config = require('./config');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const tokenFromCookie = req.cookies && req.cookies['accessToken'];

    const token = tokenFromHeader || tokenFromCookie;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.jwtSecretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

