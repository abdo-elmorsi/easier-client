const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // generate new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        // save user and respond
        const user = await newUser.save();
        res.status(200).send(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const login = async (req, res) => {
    try {
        // no email
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("User not found");
        // no password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !validPassword && res.status(400).json("Wrong password");

        // valid
        const token = jwt.sign(user._doc, process.env.JWT_KEY, {
            expiresIn: "1d",
        });
        const { password, __v, updatedAt, createdAt, ...others } = user._doc;
        res.cookie("token", token, { httpOnly: true })
            .status(200)
            .json({ ...others, token });
    } catch (error) {
        return res.status(500).json(error.message);
    }
};
const logOut = (req, res) => {
    res.clearCookie("token", {
        secure: true,
        sameSite: "none",
    })
        .status(200)
        .json("User has been logged out.");
};

module.exports = {
    register,
    login,
    logOut,
};
