const Users = require("../../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const verified = jwt.verify(token, process.env.JWT_KEY);
        const user = await Users.findById(verified._id);

        if (!user) {
            throw new Error("Authentication failed");
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send(e.message);
    }
};

const checkRole = (role) => async (req, res, next) => {
    try {
        const { user } = req;
        if (user.role !== role && user.role !== "superAdmin") {
            return res
                .status(401)
                .json({ message: `Only ${role}s can perform this action` });
        }
        next();
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const isAdmin = checkRole("admin");
const isSuperAdmin = checkRole("superAdmin");

module.exports = {
    auth,
    isAdmin,
    isSuperAdmin,
};
