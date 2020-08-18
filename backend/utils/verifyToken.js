const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token)
        return res.json({
            status: 403,
            auth: false,
            message: 'No token provided.'
        });
    jwt.verify(token, "mobil", function (err, decoded) {
        if (err)
            return res.json({
                status: 500,
                auth: false,
                message: 'Failed to authenticate token.',
                value: 0
            });
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;