require("./db/mongoose");
const errorHandler = require("./middlewares/errorHandler");

const express = require("express");
// to user hot reload
const morgan = require("morgan");
// secure my Express app
const helmet = require("helmet");
// to use .env file
const dotenv = require("dotenv");
// to ignore cors error in production
const cors = require("cors");
// to use cookies
const cookieParser = require("cookie-parser");



// routes
const UserRoutes = require("../routers/user");
const TowerRoutes = require("../routers/tower");
const FlatRouter = require("../routers/flat");

const app = express();
dotenv.config();

app.use(errorHandler);


//middleWares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

// routers
app.use("/users", UserRoutes);
app.use("/towers", TowerRoutes);
app.use("/flats", FlatRouter);

app.get("/", async (req, res) => {
    res.send("<h1>Welcome Abdo</h1>");
});

module.exports = app;
