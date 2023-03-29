const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const TowerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tower name is required!"],
        },
        address: {
            type: String,
            required: false,
        },
        flats: [
            {
                type: ObjectId,
                ref: "Flat",
            },
        ],
        // floors: [
        //     {
        //         name: {
        //             type: String,
        //             required: [true, "Flat name is required!"],
        //         },
        //         flats: [
        //             {
        //                 name: {
        //                     type: String,
        //                     required: [true, "Flat name is required!"],
        //                 },
        //                 rentPrice: {
        //                     type: Number,
        //                     required: [true, "Rent price is required!"],
        //                 },
        //                 maintenancePrice: {
        //                     type: Number,
        //                     required: [true, "Maintenance price is required!"],
        //                 },
        //                 userName: {
        //                     type: String,
        //                     required: [true, "Username is required!"],
        //                     default: "user",
        //                 },
        //                 password: {
        //                     type: String,
        //                     required: true,
        //                     minlength: [
        //                         6,
        //                         "Password must be more than 6 characters",
        //                     ],
        //                     // default: this.name,
        //                 },
        //             },
        //         ],
        //     },
        // ],
        // shops: [
        //     {
        //         name: {
        //             type: String,
        //             required: [true, "Flat name is required!"],
        //         },
        //         rentPrice: {
        //             type: Number,
        //             required: [true, "Rent price is required!"],
        //         },
        //         userName: {
        //             type: String,
        //             required: [true, "Username is required!"],
        //             default: "user",
        //         },
        //         password: {
        //             type: String,
        //             required: true,
        //             minlength: [6, "Password must be more than 6 characters"],
        //             // default: this.name,
        //         },
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

// TowerSchema.pre("save", async function (next) {
//     this.password = this.name;
//     next();
// });

TowerSchema.pre(/^find/, function (next) {
    this.populate({
        path: "flats",
        // select: "-_id -address -floors._id -floors.flats._id",
    });
    next();
});

const Tower = mongoose.model("Tower", TowerSchema);

module.exports = Tower;
