const express = require("express");

const {
    createMilestone,
    getMilestones,
    updateMilestone
} = require("../controllers/milestoneController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE MILESTONE FOR PROJECT
// POST /api/milestones/project/:projectId
// =====================================================

router.post(
    "/project/:projectId",
    protect,
    createMilestone
);


// =====================================================
// GET ALL MILESTONES FOR PROJECT
// GET /api/milestones/project/:projectId
// =====================================================

router.get(
    "/project/:projectId",
    protect,
    getMilestones
);


// =====================================================
// UPDATE MILESTONE
// PUT /api/milestones/:id
// =====================================================

router.put(
    "/:id",
    protect,
    updateMilestone
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;