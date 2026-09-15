const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        proposal: {
            type: String,
            required: true
        },

        bidAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", applicationSchema);