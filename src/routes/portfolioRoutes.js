const express = require("express");

const {
    getPortfolio,
    updatePortfolio
} = require("../controllers/portfolioController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET freelancer portfolio
router.get(
    "/",
    protect,
    getPortfolio
);

// UPDATE freelancer portfolio
router.put(
    "/",
    protect,
    updatePortfolio
);

module.exports = router;