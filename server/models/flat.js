const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const FlatSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
            required: [true, "Flat number is required!"],
        },
        floorNumber: {
            type: Number,
            required: [true, "Floor number is required!"],
        },
        rentPrice: {
            type: Number,
            required: [true, "Rent price is required!"],
        },
        maintenancePrice: {
            type: Number,
            required: [true, "Maintenance price is required!"],
        },
        userName: {
            type: String,
            required: [true, "Username is required!"],
            default: `flat-${this.floorNumber}-${this.number}`,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be more than 6 characters"],
            default: `flat-${this.floorNumber}-${this.number}`,
        },
        tower: {
            type: String,
            required: [true, "Tower id is required!"],
        },
        // floor: {
        //     type: ObjectId,
        //     ref: "Floor",
        // },
    },
    {
        timestamps: true,
    }
);

FlatSchema.pre("save", async function (next) {
    this.userName = `flat-${this.floorNumber}-${this.number}`;
    this.password = `flat-${this.floorNumber}-${this.number}`;
    next();
});

// FlatSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: "floor",
//         // select: "-_id",
//     });
//     next();
// });

const Flat = mongoose.model("Flat", FlatSchema);

module.exports = Flat;
