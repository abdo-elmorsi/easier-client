const User = require("../models/user");
const cloudinary = require("cloudinary").v2;

const signUp = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role } = req.body;
        const user = new User({
            name,
            email,
            password,
            phoneNumber,
            role,
        });
        await user.save();
        if (!user)
            return res.status(400).json({ message: "failed to signup!" });

        const token = user.generateAuthToken();
        return res.status(201).json({ user, token });
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

const deleteProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await User.findByIdAndDelete(_id);
        return res.status(200).json({ user });
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
    signUp: signUp,
    signIn: signIn,
    getProfile: getProfile,
    deleteProfile: deleteProfile,
    updateProfile: updateProfile,
    uploadProfilePic: uploadProfilePic,
};
