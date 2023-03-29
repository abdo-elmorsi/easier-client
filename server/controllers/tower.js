const User = require("../models/user");
const Tower = require("../models/tower");

const createTower = async (req, res) => {
    try {
        const { name, address } = req.body;
        const tower = new Tower({
            name,
            address,
        });
        await tower.save();
        // add the tower to the user
        await req.user.updateOne({ $push: { towers: tower._id } });
        return res.status(201).json(tower);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const getAllTowers = async (req, res) => {
    try {
        const { role } = req.user;
        if (role === "superAdmin" || role === "admin") {
            const Towers = await Tower.find({});
            return res.status(200).json({ Towers });
        } else {
            return res.status(400).json({
                message: "Your don't have permissions get towers",
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const getTower = async (req, res) => {
    try {
        const { role } = req.user;
        if (role === "superAdmin" || role === "admin") {
            const Towers = await Tower.find({ _id: req.params.id });
            return res.status(200).json({ Towers });
        } else {
            return res.status(400).json({
                message: "Your don't have permissions get the tower",
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const deleteTower = async (req, res) => {
    try {
        const { role } = req.user;
        if (role === "superAdmin" || role === "admin") {
            const tower = await Tower.findByIdAndDelete(req.params.id);
            if (!tower) {
                return res.status(404).json({ message: "Tower not found!" });
            }
            // delete the tower from the user
            await req.user.updateOne({ $pull: { towers: tower._id } });
            // delete all flats in this tower
            await Flat.deleteMany({ tower: tower._id });
            return res
                .status(200)
                .json({ message: "Tower deleted successfully." });
        } else {
            return res.status(400).json({
                message: "Your don't have permissions delete the tower",
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const updateTower = async (req, res) => {
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

module.exports = {
    createTower,
    updateTower,
    getAllTowers,
    getTower,
    deleteTower,
};
