const express = require("express");

const {
    submitProposal,
    getProjectProposals,
    shortlistProposal,
    acceptProposal
} = require("../controllers/proposalController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/project/:projectId",
    protect,
    authorize("freelancer"),
    submitProposal
);

router.get(
    "/project/:projectId",
    protect,
    authorize("client"),
    getProjectProposals
);

router.put(
    "/:id/shortlist",
    protect,
    authorize("client"),
    shortlistProposal
);

router.put(
    "/:id/accept",
    protect,
    authorize("client"),
    acceptProposal
);

module.exports = router;