const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
);

// One client can review one freelancer only once for a project
reviewSchema.index(
    {
        project: 1,
        client: 1,
        freelancer: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Review", reviewSchema);