const router = require("express").Router();

const {
    createTower,
    updateTower,
    getTower
} = require("../controllers/tower");

// router.post("/", createTower);
// router.post("/signIn", signIn);
router
    .route("/")
    .post(createTower)
    .get(getTower)
    .put(updateTower)
    // .delete(auth, deleteProfile);

module.exports = router;
