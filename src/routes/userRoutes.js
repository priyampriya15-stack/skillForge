const express = require("express");

const {
    getProfile,
    updateProfile,
    getFreelancers,
    getFreelancerStats,
    getClientDashboard,
} = require("../controllers/userController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// PUBLIC / FREELANCER DATA
// =====================================================

router.get(
    "/freelancers",
    protect,
    getFreelancers
);

router.get(
    "/freelancer-stats",
    protect,
    getFreelancerStats
);


// =====================================================
// CLIENT DASHBOARD
// =====================================================

router.get(
    "/client-dashboard",
    protect,
    getClientDashboard
);


// =====================================================
// LOGGED-IN USER PROFILE
// =====================================================

router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);


module.exports = router;