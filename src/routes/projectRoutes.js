
const express = require("express");

const router = express.Router();

// =====================================================
// IMPORT CONTROLLER
// =====================================================

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// =====================================================
// IMPORT MIDDLEWARE
// =====================================================

// Change this path/name only if your auth middleware
// has a different filename or exported function.
const { protect } = require("../middleware/authMiddleware");


// =====================================================
// PROJECT ROUTES
// =====================================================

// GET ALL PROJECTS
// GET /api/projects
router.get(
    "/",
    getProjects
);


// GET SINGLE PROJECT
// GET /api/projects/:id
router.get(
    "/:id",
    getProjectById
);


// CREATE PROJECT
// POST /api/projects
// Client only
router.post(
    "/",
    protect,
    createProject
);


// UPDATE PROJECT
// PUT /api/projects/:id
// Client only
router.put(
    "/:id",
    protect,
    updateProject
);


// DELETE PROJECT
// DELETE /api/projects/:id
// Client only
router.delete(
    "/:id",
    protect,
    deleteProject
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

