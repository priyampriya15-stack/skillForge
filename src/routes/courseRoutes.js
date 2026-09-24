const express = require("express");

const router = express.Router();

const courseController = require("../controllers/courseController");

// ==========================================
// COURSE ROUTES
// ==========================================

// GET all published courses
// GET /api/courses
router.get("/", courseController.getCourses);

// GET single course
// GET /api/courses/:id
router.get("/:id", courseController.getCourseById);

// CREATE course
// POST /api/courses
router.post("/", courseController.createCourse);

// UPDATE course
// PUT /api/courses/:id
router.put("/:id", courseController.updateCourse);

// DELETE course
// DELETE /api/courses/:id
router.delete("/:id", courseController.deleteCourse);

module.exports = router;