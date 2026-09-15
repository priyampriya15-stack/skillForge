const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        category: {
            type: String,
            required: true
        },

        budget: {
            type: Number,
            required: true
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "open",
                "in_progress",
                "completed",
                "cancelled"
            ],
            default: "open"
        },

        selectedFreelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);