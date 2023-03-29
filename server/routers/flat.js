const router = require("express").Router();
const { auth } = require("../src/middlewares/auth");

const {
    createFlat,
    updateFlat,
    getAllFlats,
    getFlat,
    deleteFlat,
} = require("../controllers/flat");

// router.post("/", createFlat);
// router.post("/signIn", signIn);
router
    .route("/")
    .post(auth, createFlat)
    .get(auth, getAllFlats)
    .put(auth, updateFlat);
router.route("/:id").get(auth, getFlat);
router.route("/:id").delete(auth, deleteFlat);
// .delete(auth, deleteProfile);

module.exports = router;
