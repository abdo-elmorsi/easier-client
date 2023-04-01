const User = require("../models/user");
const cloudinary = require("cloudinary").v2;

const createUser = async (req, res) => {
    try {
        const { userName, email, phoneNumber, password, role } = req.body;
        const newUser = new User({
            userName,
            email,
            role,
            phoneNumber,
            password,
        });
        await newUser.save();
        if (!newUser)
            return res.status(400).json({ message: "failed to create user!" });
        const token = newUser.generateAuthToken();
        return res.status(201).json({ newUser, token });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ message: "email and password are required!" });

        const user = await User.findUser(email, password);
        if (!user)
            return res
                .status(400)
                .json({ message: "wrong email or password!" });

        const token = await user.generateAuthToken();
        return res.status(200).send({ user, token });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const { user } = req;
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        user.remove();
        return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const { _id } = req.user;

        const user = await User.findByIdAndUpdate(
            _id,
            { name, email, password, phoneNumber },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res
                .status(400)
                .json({ message: "error while updating a user" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const uploadProfilePic = async (req, res) => {
    try {
        const { user, file } = req;

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
        });

        const { public_id, secure_url } = await cloudinary.uploader.upload(
            file.path
        );
        user.profile_picture = {
            public_id,
            secure_url,
        };
        if (!public_id || !secure_url)
            return res.status(400).json({ message: "uploaded failed" });

        await user.save();
        return res.status(200).json({ message: "uploaded successfully" });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    signIn,
    getProfile,
    getAllUsers,
    deleteUser,
    updateProfile,
    uploadProfilePic,
};
