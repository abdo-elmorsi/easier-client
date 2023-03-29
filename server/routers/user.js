const router = require("express").Router();

const { upload } = require("../src/middlewares/upload");
const { auth } = require("../src/middlewares/auth");
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
    .post(auth, createUser)
    .get(auth, getAllUsers)
    .put(auth, updateProfile)
router.get("/profile", auth, getProfile);
router.route("/:id").delete(auth, deleteUser);

router.post("/upload", auth, upload.single("photo"), uploadProfilePic);

module.exports = router;
