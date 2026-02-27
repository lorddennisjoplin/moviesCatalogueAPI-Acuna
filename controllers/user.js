const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');

const { errorHandler } = require('../auth');

module.exports.registerUser = async (req, res) => {
    try {
        // Validate email
        if (!req.body.email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }

        // Validate password length
        if (req.body.password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Create new user
        const newUser = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const savedUser = await newUser.save();
        return res.status(201).json({
            message: "Registered successfully.",
            userId: savedUser._id
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email.includes("@")) {
        return res.status(400).send({ success: false, message: "Invalid email format." });
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                // Email not found
                return res.status(404).send({ success: false, message: "Email does not exist." });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                // Password incorrect
                return res.status(401).send({ success: false, message: "Incorrect password." });
            }

            // Successful login
            return res.status(200).send({ 
                success: true, 
                access: auth.createAccessToken(user),
                message: "Log in successful." 
            });
        })
        .catch(error => errorHandler(error, req, res));
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