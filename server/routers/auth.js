const router = require('express').Router();
const { register, login, logOut } = require('../controllers/auth');


router.post('/register', register);

router.post("/login", login);

router.post("/logout", logOut);

module.exports = router;
