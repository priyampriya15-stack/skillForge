const Review = require("../models/Review");
const Project = require("../models/Project");
const mongoose = require("mongoose");

// =====================================================
// CREATE REVIEW
// POST /api/reviews/project/:projectId
// =====================================================
const createReview = async (req, res) => {
    try {

        const { rating, comment } = req.body;
        const { projectId } = req.params;

        // ---------------------------------------------
        // Check Project ID
        // ---------------------------------------------
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        // ---------------------------------------------
        // Check Rating
        // ---------------------------------------------
        if (!rating) {
            return res.status(400).json({
                success: false,
                message: "Rating is required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // ---------------------------------------------
        // Find Project
        // ---------------------------------------------
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // ---------------------------------------------
        // Project must be completed
        // ---------------------------------------------
        if (project.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Project must be completed first"
            });
        }

        // ---------------------------------------------
        // Check Assigned Freelancer
        // ---------------------------------------------
        if (!project.selectedFreelancer) {
            return res.status(400).json({
                success: false,
                message: "No freelancer assigned to this project"
            });
        }

        // ---------------------------------------------
        // Only Project Client can give review
        // ---------------------------------------------
        if (
            project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Only the project client can submit a review"
            });
        }

        // ---------------------------------------------
        // Check Existing Review
        // ---------------------------------------------
        const existingReview = await Review.findOne({
            project: project._id,
            reviewer: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Review already submitted"
            });
        }

        // ---------------------------------------------
        // Create Review
        // IMPORTANT:
        // reviewee = selected freelancer User ID
        // ---------------------------------------------
        const review = await Review.create({
            project: project._id,
            reviewer: req.user._id,
            reviewee: project.selectedFreelancer,
            rating: Number(rating),
            comment: comment ? comment.trim() : ""
        });

        // ---------------------------------------------
        // Response
        // ---------------------------------------------
        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });

    } catch (error) {

        console.log("Create Review Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET USER REVIEWS
// GET /api/reviews/user/:userId
// =====================================================
const getUserReviews = async (req, res) => {
    try {

        const { userId } = req.params;

        // ---------------------------------------------
        // Check User ID
        // ---------------------------------------------
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // ---------------------------------------------
        // Find Reviews
        // ---------------------------------------------
        const reviews = await Review.find({
            reviewee: userId
        })
            .populate(
                "reviewer",
                "name profileImage"
            )
            .populate(
                "project",
                "title"
            )
            .sort({
                createdAt: -1
            });

        // ---------------------------------------------
        // Response
        // ---------------------------------------------
        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {

        console.log("Get User Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createReview,
    getUserReviews
};