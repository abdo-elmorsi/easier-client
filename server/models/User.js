const mongoose = require("mongoose");
const Tower = require("./tower");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            unique: false,
            required: [true, "Username is required!"],
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "Please provide your email"],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("please enter a correct email");
                }
            },
        },
        phoneNumber: {
            type: String,
            default: null,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isMobilePhone(value, ["ar-EG"])) {
                    throw new Error("Please Enter a Correct Phone Number");
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be more than 6 chart"],
        },
        role: {
            type: String,
            enum: ["tenant", "admin", "superAdmin"],
            default: "tenant",
        },
        towers: [
            {
                type: ObjectId,
                ref: "Tower",
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    // delete user.profile_picture;
    // delete user.carts;

    return user;
};

// userSchema.virtual("Tower", {
//     ref: "Tower",
//     localField: "_id", // what the local field equal here !! of curse id because we pass it as vendor
//     foreignField: "vendor", // field name which create the relationship
// });

// userSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: "towers",
//         // select: "-_id -address -floors._id -floors.flats._id",
//     });
//     next();
// });

userSchema.statics.findUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User Doesn't Exist");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Wrong Password!. Please Confirm Password");
    }
    return user;
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_KEY);
    return token;
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
