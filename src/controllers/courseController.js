const Course = require("../models/Course");

// =====================================================
// GET ALL COURSES
// GET /api/courses
// =====================================================

const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
    } = req.query;

    const filter = {
      isActive: true,
      status: "Published",
    };

    // Search
    if (search && search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          level: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Level filter
    if (level && level !== "All") {
      filter.level = level;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE COURSE
// GET /api/courses/:id
// =====================================================

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      isActive: true,
      status: "Published",
    }).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE COURSE
// POST /api/courses
// =====================================================

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      duration,
      students,
      rating,
      icon,
      image,
      instructor,
      price,
      status,
    } = req.body;

    // Required fields
    if (
      !title ||
      !description ||
      !category ||
      !level ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category, level and duration are required",
      });
    }

    // Check duplicate course
    const existingCourse = await Course.findOne({
      title: title.trim(),
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level,
      duration: duration.trim(),
      students: Number(students) || 0,
      rating: Number(rating) || 0,
      icon: icon || "BookOpen",
      image: image || "",
      instructor: instructor || null,
      price: Number(price) || 0,
      status: status || "Published",
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE COURSE
// PUT /api/courses/:id
// =====================================================

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE COURSE
// DELETE /api/courses/:id
// =====================================================

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};