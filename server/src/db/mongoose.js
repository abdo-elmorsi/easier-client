const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

console.log(MONGODB_URI);
mongoose.connect(`${MONGODB_URI}`, (err) => {
    if (err) return console.log({ message: err.message });
    console.log("DataBase Connected Successfully");
});
