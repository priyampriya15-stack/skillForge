const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        amount: {
            type: Number,
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "in_progress",
                "submitted",
                "approved",
                "completed"
            ],
            default: "pending"
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Milestone", milestoneSchema);