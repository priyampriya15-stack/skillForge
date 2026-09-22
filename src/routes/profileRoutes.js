const express = require("express");

const {
    getMyProfile,
    updateMyProfile
} = require("../controllers/profileController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET MY PROFILE
// =====================================================

router.get(
    "/me",
    protect,
    getMyProfile
);


// =====================================================
// UPDATE MY PROFILE
// =====================================================

router.put(
    "/me",
    protect,
    updateMyProfile
);


module.exports = router;