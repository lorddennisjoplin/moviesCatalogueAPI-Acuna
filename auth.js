require('dotenv').config(); // load .env variables

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET; // read from .env

// Create access token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, secret, { expiresIn: '1h' }); // optional expiration
};

// Verify JWT
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ auth: "Failed. No Token" });
    }

    token = token.slice(7); // remove "Bearer "

    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                auth: "Failed",
                message: err.message
            });
        }

        req.user = decodedToken;
        next();
    });
};

// Verify admin
module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Error handler
module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};