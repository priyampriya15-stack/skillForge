const express = require("express");

const {
    dashboard,
    getUsers,
    toggleUser,
    getAnalytics,
    getProjects,
    getProjectById,
    deleteProject
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// ADMIN DASHBOARD
// ========================================

router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    dashboard
);


// ========================================
// ADMIN ANALYTICS
// ========================================

router.get(
    "/analytics",
    protect,
    authorize("admin"),
    getAnalytics
);


// ========================================
// GET ALL USERS
// ========================================

router.get(
    "/users",
    protect,
    authorize("admin"),
    getUsers
);


// ========================================
// ACTIVATE / DEACTIVATE USER
// ========================================

router.put(
    "/users/:id/toggle",
    protect,
    authorize("admin"),
    toggleUser
);


// ========================================
// GET ALL PROJECTS
// ========================================

router.get(
    "/projects",
    protect,
    authorize("admin"),
    getProjects
);


// ========================================
// GET SINGLE PROJECT
// ========================================

router.get(
    "/projects/:id",
    protect,
    authorize("admin"),
    getProjectById
);


// ========================================
// DELETE PROJECT
// ========================================

router.delete(
    "/projects/:id",
    protect,
    authorize("admin"),
    deleteProject
);


module.exports = router;