const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            unique: true,
            required: [true, "Username is required!"],
        },
        email: {
            type: String,
            unique: true,
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
        tower: {
            type: mongoose.Schema.ObjectId,
            ref: "tower",
        },
        // towers: [
        //     {
        //         tower: {
        //             type: mongoose.Schema.ObjectId,
        //             ref: "tower",
        //         },
        //     },
        // ],
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

// userSchema.virtual("tower", {
//     ref: "tower",
//     localField: "_id", // what the local field equal here !! of curse id because we pass it as vendor
//     foreignField: "vendor", // field name which create the relationship
// });

userSchema.pre(/^find/, function (next) {
    this.populate("tower");
    next();
});

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
    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
