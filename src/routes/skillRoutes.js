const express = require("express");
const router = express.Router();

const skillController = require("../controllers/skillController");

// =====================================================
// SKILL ROUTES
// =====================================================

// GET all skills
router.get("/", skillController.getSkills);

// GET single skill
router.get("/:id", skillController.getSkillById);

// CREATE skill
router.post("/", skillController.createSkill);

// UPDATE skill
router.put("/:id", skillController.updateSkill);

// DELETE skill
router.delete("/:id", skillController.deleteSkill);

module.exports = router;