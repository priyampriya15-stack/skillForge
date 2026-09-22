const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        // ================================
        // CLIENT
        // ================================
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ================================
        // PROJECT TITLE
        // ================================
        title: {
            type: String,
            required: true,
            trim: true
        },

        // ================================
        // PROJECT DESCRIPTION
        // ================================
        description: {
            type: String,
            required: true,
            trim: true
        },

        // ================================
        // REQUIRED SKILLS
        // Example: ["React", "Node.js", "MongoDB"]
        // ================================
        skills: {
            type: [String],
            required: true,
            default: []
        },

        // ================================
        // CATEGORY
        // ================================
        category: {
            type: String,
            required: true,
            trim: true
        },

        // ================================
        // BUDGET
        // ================================
        budget: {
            type: Number,
            required: true,
            min: 1
        },

        // ================================
        // DEADLINE
        // ================================
        deadline: {
            type: Date,
            required: true
        },

        // ================================
        // PROJECT STATUS
        // ================================
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

        // ================================
        // SELECTED FREELANCER
        // ================================
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