const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (user.isAdmin) {
            const users = await User.find();
            res.status(200).json(users);
        } else {
            res.status(403).json(user);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { createdAt, updatedAt, password, __v, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error.message);
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("User Updated");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
};

const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findOneAndDelete(req.params.id);
            res.status(200).json("User Deleted");
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
};

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
