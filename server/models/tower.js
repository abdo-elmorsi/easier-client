const mongoose = require("mongoose");

const TowerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tower name is required!"],
        },
        address: {
            type: String,
            required: [true, "Tower address is required!"],
        },
        // vendor: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: "user",
        // },
        floors: [
            {
                flats: [
                    {
                        name: {
                            type: String,
                            required: [true, "Flat name is required!"],
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
                            default: "user",
                        },
                        password: {
                            type: String,
                            required: true,
                            minlength: [
                                6,
                                "Password must be more than 6 characters",
                            ],
                            // default: this.name,
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

TowerSchema.pre("save", async function (next) {
    this.password = this.name;
    next();
});
const Tower = mongoose.model("tower", TowerSchema);

module.exports = Tower;
