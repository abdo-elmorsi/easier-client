const router = require("express").Router();

const { upload } = require("../src/middlewares/upload");
const { auth, isAdmin, isSuperAdmin } = require("../src/middlewares/auth");
const {
    createUser,
    signIn,
    getProfile,
    getAllUsers,
    deleteUser,
    updateProfile,
    uploadProfilePic,
} = require("../controllers/user");

router.post("/signIn", signIn);

router
    .route("/")
    .post(auth, isSuperAdmin, createUser)
    .get(auth, isSuperAdmin, getAllUsers)
    .put(auth, isAdmin, updateProfile);

router.delete("/:id", auth, isSuperAdmin, deleteUser);
router.get("/profile", auth, isAdmin, getProfile);

router.post("/upload", auth, upload.single("photo"), uploadProfilePic);

module.exports = router;
