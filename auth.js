// Fixed
const jwt = require("jsonwebtoken");
const secret = "MoviesDatabaseAPI";


module.exports.createAccessToken = (user) => {

    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    };

    return jwt.sign(data, secret, {});
    
};

module.exports.verify = (req, res, next) => {
    // console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, function(err, decodedToken){

            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                req.user = decodedToken;
                next();
            }
        })
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send({
            message: 'Access denied. Admins only.'
        });
    }

    next();
};

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