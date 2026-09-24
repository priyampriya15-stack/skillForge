const User = require("../models/User");

// ==========================================
// GET FREELANCER PORTFOLIO
// GET /api/freelancer/portfolio
// ==========================================
const getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const user = await User.findById(userId).select(
            "name email role portfolio"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "freelancer") {
            return res.status(403).json({
                success: false,
                message: "Only freelancers can access portfolio",
            });
        }

        return res.status(200).json({
            success: true,
            portfolio: user.portfolio || [],
        });

    } catch (error) {
        console.error("GET PORTFOLIO ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// ==========================================
// UPDATE FREELANCER PORTFOLIO
// PUT /api/freelancer/portfolio
// ==========================================
const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const { portfolio } = req.body;

        if (!Array.isArray(portfolio)) {
            return res.status(400).json({
                success: false,
                message: "Portfolio must be an array",
            });
        }

        const cleanedPortfolio = portfolio.map((item) => ({
            title: String(item.title || "").trim(),
            url: String(item.url || "").trim(),
            description: String(item.description || "").trim(),
        }));

        // ==========================================
        // VALIDATE PORTFOLIO
        // ==========================================

        for (const item of cleanedPortfolio) {

            if (!item.title) {
                return res.status(400).json({
                    success: false,
                    message: "Project title is required",
                });
            }

            if (!item.url) {
                return res.status(400).json({
                    success: false,
                    message: "Project URL is required",
                });
            }
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "freelancer") {
            return res.status(403).json({
                success: false,
                message: "Only freelancers can update portfolio",
            });
        }

        // ==========================================
        // SAVE PORTFOLIO
        // ==========================================

        user.portfolio = cleanedPortfolio;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Portfolio updated successfully",
            portfolio: user.portfolio,
        });

    } catch (error) {
        console.error("UPDATE PORTFOLIO ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


module.exports = {
    getPortfolio,
    updatePortfolio,
};