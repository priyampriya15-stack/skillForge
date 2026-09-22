const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// =====================================================
// CHECK CONTROLLER FUNCTIONS
// =====================================================

console.log("======================================");
console.log("PROJECT CONTROLLER CHECK");
console.log("======================================");

console.log("createProject:", typeof projectController.createProject);
console.log("getProjects:", typeof projectController.getProjects);
console.log("getMyProjects:", typeof projectController.getMyProjects);
console.log("getProjectById:", typeof projectController.getProjectById);
console.log("updateProject:", typeof projectController.updateProject);
console.log("deleteProject:", typeof projectController.deleteProject);

console.log("======================================");

// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================

router.post(
    "/",
    protect,
    projectController.createProject
);

// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================================

router.get(
    "/",
    protect,
    projectController.getProjects
);

// =====================================================
// GET MY PROJECTS
// IMPORTANT: BEFORE /:id
// GET /api/projects/my-projects
// =====================================================

router.get(
    "/my-projects",
    protect,
    projectController.getMyProjects
);

// =====================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =====================================================

router.get(
    "/:id",
    protect,
    projectController.getProjectById
);

// =====================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================================

router.put(
    "/:id",
    protect,
    projectController.updateProject
);

// =====================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    projectController.deleteProject
);

module.exports = router;