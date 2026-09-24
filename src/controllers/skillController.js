const Skill = require("../models/Skill");

// =====================================================
// GET ALL SKILLS
// GET /api/skills
// =====================================================
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      isActive: true,
    }).sort({
      category: 1,
      title: 1,
    });

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    console.error("GET SKILLS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE SKILL
// GET /api/skills/:id
// =====================================================
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("GET SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE SKILL
// POST /api/skills
// =====================================================
const createSkill = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      icon,
      skills,
    } = req.body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // -----------------------------------------------
    // Check duplicate skill
    // -----------------------------------------------
    const existingSkill = await Skill.findOne({
      title: title.trim(),
    });

    if (existingSkill) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists",
      });
    }

    // -----------------------------------------------
    // Create skill
    // -----------------------------------------------
    const skill = await Skill.create({
      title: title.trim(),
      category: category.trim(),
      description: description
        ? description.trim()
        : "",
      icon: icon || "Code2",
      skills: Array.isArray(skills)
        ? skills
        : [],
      isActive: true,
    });

    // -----------------------------------------------
    // Success response
    // -----------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    console.error("CREATE SKILL ERROR:", error);

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Skill validation failed",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create skill",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SKILL
// PUT /api/skills/:id
// =====================================================
const updateSkill = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      icon,
      skills,
      isActive,
    } = req.body;

    // -----------------------------------------------
    // Build update object
    // -----------------------------------------------
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      updateData.title = title.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty",
        });
      }

      updateData.category = category.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (icon !== undefined) {
      updateData.icon = icon;
    }

    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills)
        ? skills
        : [];
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // -----------------------------------------------
    // Check duplicate title
    // -----------------------------------------------
    if (updateData.title) {
      const duplicateSkill = await Skill.findOne({
        title: updateData.title,
        _id: {
          $ne: req.params.id,
        },
      });

      if (duplicateSkill) {
        return res.status(409).json({
          success: false,
          message: "Another skill with this title already exists",
        });
      }
    }

    // -----------------------------------------------
    // Update
    // -----------------------------------------------
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("UPDATE SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skill",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SKILL
// DELETE /api/skills/:id
// =====================================================
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(
      req.params.id
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};