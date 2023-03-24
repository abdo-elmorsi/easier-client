const Tower = require("../models/tower");

const createTower = async (req, res) => {
    try {
        const { name, address, floors } = req.body;
        const tower = new Tower({
            name,
            address,
            floors,
        });
        await tower.save();
        if (!tower)
            return res
                .status(400)
                .json({ message: "Some sing went wrong please try again!" });
        return res.status(201).json(tower);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
const getTower = async (req, res) => {
    try {
        const { name, address, floors } = req.body;
        const tower = new Tower({
            name,
            address,
            floors,
        });
        await tower.save();
        if (!tower)
            return res
                .status(400)
                .json({ message: "Some sing went wrong please try again!" });
        return res.status(201).json(tower);
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
    getTower
};
