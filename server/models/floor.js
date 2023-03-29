const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const FloorSchema = new mongoose.Schema(
    {
        number: {
            type: Number,
            required: [true, "Floor number is required!"],
        },
        // tower: {
        //     type: ObjectId,
        //     ref: "Tower",
        // },
        flats: [
            {
                type: ObjectId,
                ref: "Flat",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// FloorSchema.pre("save", async function (next) {
//     this.password = this.name;
//     next();
// });

// FloorSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: "tower",
//         // select: "-_id",
//     });
//     next();
// });

FloorSchema.pre(/^find/, function (next) {
    this.populate({
        path: "flats",
        // select: "-_id -address -floors._id -floors.flats._id",
    });
    next();
});
const Floor = mongoose.model("Floor", FloorSchema);

module.exports = Floor;
