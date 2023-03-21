const router = require("express").Router();

const { upload } = require("../src/middlewares/upload");
const { auth } = require("../src/middlewares/auth");
const {
    signUp,
    signIn,
    getProfile,
    deleteProfile,
    updateProfile,
    uploadProfilePic,
} = require("../controllers/user");

router.post("/", signUp);
router.post("/signIn", signIn);
router
    .route("/")
    .post(signUp)
    .get(auth, getProfile)
    .put(auth, updateProfile)
    .delete(auth, deleteProfile);
router.post("/upload", auth, upload.single("photo"), uploadProfilePic);

module.exports = router;
