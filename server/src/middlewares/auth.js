const Users = require("../../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const verified = jwt.verify(token, process.env.JWT_KEY);
        const user = await Users.findById(verified._id);

        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send("Please Auth!");
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const { role } = req.user;
        if (role != "admin") {
            return res
                .status(401)
                .json({ message: "only admins can perform this action" });
        }
        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    auth,
    isAdmin,
};
