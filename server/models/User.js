const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const Products = require("./product");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("please enter a correct email");
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
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
        role: {
            required: true,
            type: String,
        },
        profile_picture: {
            public_id: String,
            secure_url: String,
        },
        // carts: [
        //     {
        //         cart: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: "products",
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
    delete user.profile_picture;
    // delete user.carts;

    return user;
};

// userSchema.virtual("products", {
//     ref: "products",
//     localField: "_id", // what the local field equal here !! of curse id because we pass it as vendor
//     foreignField: "vendor", // field name which create the relationship
// });

userSchema.statics.findUser = async (email, password) => {
    const user = await Users.findOne({ email });
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

// userSchema.pre("findByIdAndDelete", async function (next) {
//     await Products.deleteMany({ vendor: this._id });
//     next();
// });

const Users = mongoose.model("users", userSchema);

module.exports = Users;
