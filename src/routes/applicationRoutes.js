const express = require("express");

const {
    applyProject,
    getMyApplications,
    getProjectApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// Freelancer applies for project
// POST /api/applications/project/:projectId
// ==========================================

router.post(
    "/project/:projectId",
    protect,
    authorize("freelancer"),
    applyProject
);


// ==========================================
// Freelancer views own applications
// GET /api/applications/my
// ==========================================

router.get(
    "/my",
    protect,
    authorize("freelancer"),
    getMyApplications
);


// ==========================================
// Client views project applications
// GET /api/applications/project/:projectId
// ==========================================

router.get(
    "/project/:projectId",
    protect,
    authorize("client"),
    getProjectApplications
);


// ==========================================
// Client accepts / rejects application
// PUT /api/applications/:id/status
// ==========================================

router.put(
    "/:id/status",
    protect,
    authorize("client"),
    updateApplicationStatus
);


module.exports = router;