const express = require("express");

const router = express.Router();

const {
    applyProject,
    getMyApplications,
    getProjectApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");


// =====================================================
// FREELANCER - APPLY FOR PROJECT
// POST /api/applications/:projectId
// =====================================================

router.post(
    "/:projectId",
    protect,
    applyProject
);


// =====================================================
// FREELANCER - GET MY APPLICATIONS
// GET /api/applications/my-applications
// =====================================================

router.get(
    "/my-applications",
    protect,
    getMyApplications
);


// =====================================================
// CLIENT - GET APPLICATIONS FOR PROJECT
// GET /api/applications/project/:projectId
// =====================================================

router.get(
    "/project/:projectId",
    protect,
    getProjectApplications
);


// =====================================================
// CLIENT - ACCEPT / REJECT APPLICATION
// PUT /api/applications/:id/status
// =====================================================

router.put(
    "/:id/status",
    protect,
    updateApplicationStatus
);


module.exports = router;