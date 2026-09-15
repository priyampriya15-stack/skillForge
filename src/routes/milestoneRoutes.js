const express = require("express");

const {
    createMilestone,
    getMilestones,
    updateMilestone
} = require("../controllers/milestoneController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/project/:projectId",
    protect,
    createMilestone
);

router.get(
    "/project/:projectId",
    protect,
    getMilestones
);

router.put(
    "/:id",
    protect,
    updateMilestone
);

module.exports = router;