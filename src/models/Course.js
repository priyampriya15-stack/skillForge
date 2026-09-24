const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // =====================================================
    // COURSE TITLE
    // =====================================================
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    // =====================================================
    // COURSE DESCRIPTION
    // =====================================================
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: 1000,
    },

    // =====================================================
    // CATEGORY
    // =====================================================
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
      enum: [
        "Web Development",
        "Frontend",
        "Backend",
        "Database",
        "Programming",
        "Design",
        "Mobile",
        "Artificial Intelligence",
        "Data Analytics",
        "Cloud Computing",
        "Cyber Security",
        "Other",
      ],
    },

    // =====================================================
    // LEVEL
    // =====================================================
    level: {
      type: String,
      required: [true, "Course level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // =====================================================
    // DURATION
    // Example: "8 Weeks"
    // =====================================================
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },

    // =====================================================
    // STUDENTS
    // =====================================================
    students: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // RATING
    // =====================================================
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // =====================================================
    // ICON
    // Frontend-la Lucide icon name store pannalam
    // Example: Code2, Database, Palette
    // =====================================================
    icon: {
      type: String,
      default: "BookOpen",
      trim: true,
    },

    // =====================================================
    // COURSE IMAGE
    // Optional
    // =====================================================
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // INSTRUCTOR
    // Optional
    // =====================================================
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // =====================================================
    // COURSE PRICE
    // =====================================================
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // COURSE STATUS
    // =====================================================
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Published",
    },

    // =====================================================
    // ACTIVE STATUS
    // =====================================================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

courseSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

courseSchema.index({
  category: 1,
  level: 1,
});

courseSchema.index({
  isActive: 1,
  status: 1,
});

// =====================================================
// MODEL
// =====================================================

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;