require("./db/mongoose");
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
const authRoutes = require("../routers/auth");

const app = express();
dotenv.config();

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
app.use("/api/auth", authRoutes);

app.get("/api", async (req, res) => {
    res.send("<h1>Welcome Abdo</h1>");
});

module.exports = app;
