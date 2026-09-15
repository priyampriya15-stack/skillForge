const express = require("express");

const {
    createReview,
    getUserReviews
} = require("../controllers/reviewController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/project/:projectId",
    protect,
    createReview
);

router.get(
    "/user/:userId",
    protect,
    getUserReviews
);

module.exports = router;