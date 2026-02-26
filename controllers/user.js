const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');

const { errorHandler } = require('../auth');

module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    else if (req.body.password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        });
    }

    else {
        let newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
        .then((result) => {
            return res.status(201).json({
                message: "Registered successfully",
            });
        })
        .catch(error => errorHandler(error, req, res));
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){

       return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // Send status 404
                return res.status(404).send(false);
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {

                    //Send status 200
                    return res.status(200).send({ access : auth.createAccessToken(result)})
                } else {

                    //Send status 401
                    return res.status(401).send(false);
                }
            }
        })
        .catch(error => errorHandler(error, req, res)); 
    } else {
        return res.status(400).send(false)
    }
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .select("-password")   // exclude password
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found" });
            return res.status(200).json({ user });
        })
        .catch(error => errorHandler(error, req, res));
};