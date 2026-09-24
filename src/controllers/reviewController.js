const Review = require("../models/Review");
const Project = require("../models/Project");
const User = require("../models/User");

// =====================================================
// CREATE REVIEW
// CLIENT -> FREELANCER
// POST /api/reviews
// =====================================================

const createReview = async (req, res) => {
    try {
        const clientId = req.user._id;

        const {
            projectId,
            freelancerId,
            rating,
            comment,
        } = req.body;

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        if (!freelancerId) {
            return res.status(400).json({
                success: false,
                message: "Freelancer ID is required",
            });
        }

        if (rating === undefined || rating === null) {
            return res.status(400).json({
                success: false,
                message: "Rating is required",
            });
        }

        const numericRating = Number(rating);

        if (
            Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: "Review comment is required",
            });
        }

        // -------------------------------------------------
        // FIND PROJECT
        // -------------------------------------------------

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // -------------------------------------------------
        // CHECK CLIENT OWNERSHIP
        // -------------------------------------------------

        const projectClientId =
            project.client?._id ||
            project.client;

        if (
            String(projectClientId) !==
            String(clientId)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to review this project",
            });
        }

        // -------------------------------------------------
        // CHECK SELECTED FREELANCER
        // -------------------------------------------------

        if (!project.selectedFreelancer) {
            return res.status(400).json({
                success: false,
                message:
                    "No freelancer is assigned to this project",
            });
        }

        const selectedFreelancerId =
            project.selectedFreelancer?._id ||
            project.selectedFreelancer;

        if (
            String(selectedFreelancerId) !==
            String(freelancerId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Freelancer is not assigned to this project",
            });
        }

        // -------------------------------------------------
        // CHECK FREELANCER EXISTS
        // -------------------------------------------------

        const freelancer =
            await User.findById(freelancerId);

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: "Freelancer not found",
            });
        }

        // -------------------------------------------------
        // CHECK DUPLICATE REVIEW
        // -------------------------------------------------

        const existingReview =
            await Review.findOne({
                project: projectId,
                client: clientId,
                freelancer: freelancerId,
            });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already reviewed this project",
            });
        }

        // -------------------------------------------------
        // CREATE REVIEW
        // -------------------------------------------------

        const review = await Review.create({
            project: projectId,
            client: clientId,
            freelancer: freelancerId,
            rating: numericRating,
            comment: comment.trim(),
        });

        // -------------------------------------------------
        // POPULATE
        // -------------------------------------------------

        const populatedReview =
            await Review.findById(review._id)
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "project",
                    "title description"
                );

        return res.status(201).json({
            success: true,
            message:
                "Review submitted successfully",
            review: populatedReview,
        });

    } catch (error) {
        console.error(
            "CREATE REVIEW ERROR:",
            error
        );

        // Duplicate index error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already reviewed this project",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to create review",
            error: error.message,
        });
    }
};

// =====================================================
// GET MY REVIEWS
// CLIENT
// GET /api/reviews/my
// =====================================================

const getMyReviews = async (req, res) => {
    try {
        const clientId = req.user._id;

        const reviews =
            await Review.find({
                client: clientId,
            })
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "project",
                    "title description"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });

    } catch (error) {
        console.error(
            "GET MY REVIEWS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load my reviews",
            error: error.message,
        });
    }
};

// =====================================================
// GET CLIENT REVIEWS
// GET /api/reviews/client
// =====================================================

const getClientReviews = async (req, res) => {
    try {
        const clientId =
            req.params.clientId ||
            req.user._id;

        const reviews =
            await Review.find({
                client: clientId,
            })
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "project",
                    "title description"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });

    } catch (error) {
        console.error(
            "GET CLIENT REVIEWS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load client reviews",
            error: error.message,
        });
    }
};

// =====================================================
// GET FREELANCER REVIEWS
// GET /api/reviews/freelancer/:freelancerId
// =====================================================

const getFreelancerReviews = async (
    req,
    res
) => {
    try {
        const freelancerId =
            req.params.freelancerId ||
            req.user._id;

        const reviews =
            await Review.find({
                freelancer: freelancerId,
            })
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "project",
                    "title description"
                )
                .sort({
                    createdAt: -1,
                });

        const totalReviews =
            reviews.length;

        const averageRating =
            totalReviews > 0
                ? (
                      reviews.reduce(
                          (sum, review) =>
                              sum +
                              review.rating,
                          0
                      ) /
                      totalReviews
                  ).toFixed(1)
                : "0.0";

        return res.status(200).json({
            success: true,
            count: totalReviews,
            averageRating:
                Number(averageRating),
            reviews,
        });

    } catch (error) {
        console.error(
            "GET FREELANCER REVIEWS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load freelancer reviews",
            error: error.message,
        });
    }
};

// =====================================================
// GET PROJECT REVIEW
// GET /api/reviews/project/:projectId
// =====================================================

const getProjectReview = async (
    req,
    res
) => {
    try {
        const { projectId } =
            req.params;

        const review =
            await Review.findOne({
                project: projectId,
            })
                .populate(
                    "client",
                    "name email"
                )
                .populate(
                    "freelancer",
                    "name email"
                )
                .populate(
                    "project",
                    "title description"
                );

        return res.status(200).json({
            success: true,
            review: review || null,
        });

    } catch (error) {
        console.error(
            "GET PROJECT REVIEW ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load project review",
            error: error.message,
        });
    }
};

// =====================================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// =====================================================

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review =
            await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        // Only the client who created it can delete it
        if (
            String(review.client) !==
            String(req.user._id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to delete this review",
            });
        }

        await Review.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:
                "Review deleted successfully",
        });

    } catch (error) {
        console.error(
            "DELETE REVIEW ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete review",
            error: error.message,
        });
    }
};

module.exports = {
    createReview,
    getMyReviews,
    getClientReviews,
    getFreelancerReviews,
    getProjectReview,
    deleteReview,
};