const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.connect(
    process.env.MONGODB_URI ||
        "mongodb+srv://abdo-elmorsy:abdo2711-coder@cluster0.uw2xh18.mongodb.net/?retryWrites=true&w=majority",
    (err) => {
        if (err) return console.log({ message: err.message });
        console.log("connected");
    }
);
