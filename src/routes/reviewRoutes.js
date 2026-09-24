const express = require("express");

const router = express.Router();

const {
    createReview,
    getMyReviews,
    getClientReviews,
    getFreelancerReviews,
    getProjectReview,
    deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// =====================================================
// CREATE REVIEW
// POST /api/reviews
// =====================================================

router.post(
    "/",
    protect,
    createReview
);

// =====================================================
// GET MY REVIEWS
// GET /api/reviews/my
// =====================================================

router.get(
    "/my",
    protect,
    getMyReviews
);

// =====================================================
// GET MY CLIENT REVIEWS
// GET /api/reviews/client
// =====================================================

router.get(
    "/client",
    protect,
    getClientReviews
);

// =====================================================
// GET FREELANCER REVIEWS
// GET /api/reviews/freelancer/:freelancerId
// =====================================================

router.get(
    "/freelancer/:freelancerId",
    protect,
    getFreelancerReviews
);

// =====================================================
// GET PROJECT REVIEW
// GET /api/reviews/project/:projectId
// =====================================================

router.get(
    "/project/:projectId",
    protect,
    getProjectReview
);

// =====================================================
// DELETE REVIEW
// DELETE /api/reviews/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    deleteReview
);

module.exports = router;