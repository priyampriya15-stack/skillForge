const express = require("express");

const {
    recommendFreelancers,
    recommendProjectsForFreelancer,
} = require("../controllers/recommendationController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
=========================================================
CLIENT
AI Recommended Freelancers

GET /api/recommendations/projects/:projectId/freelancers
=========================================================
*/

router.get(
    "/projects/:projectId/freelancers",
    protect,
    recommendFreelancers
);


/*
=========================================================
FREELANCER
AI Recommended Projects

GET /api/recommendations/freelancer/projects
=========================================================
*/

router.get(
    "/freelancer/projects",
    protect,
    recommendProjectsForFreelancer
);


module.exports = router;