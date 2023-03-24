const router = require("express").Router();
const { auth } = require("../src/middlewares/auth");

const {
    createTower,
    updateTower,
    getAllTowers,
    getTower,
} = require("../controllers/tower");

// router.post("/", createTower);
// router.post("/signIn", signIn);
router
    .route("/")
    .post(auth, createTower)
    .get(auth, getAllTowers)
    .put(auth, updateTower);
router.route("/:id").get(auth, getTower);
// .delete(auth, deleteProfile);

module.exports = router;
