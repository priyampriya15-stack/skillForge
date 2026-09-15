const User = require("../models/User");
const Project = require("../models/Project");
const Proposal = require("../models/Proposal");
const Payment = require("../models/Payment");

// ========================================
// ADMIN DASHBOARD
// ========================================

const dashboard = async (req, res) => {
    try {

        const users = await User.countDocuments();

        const clients = await User.countDocuments({
            role: "client"
        });

        const freelancers = await User.countDocuments({
            role: "freelancer"
        });

        const projects = await Project.countDocuments();

        const openProjects = await Project.countDocuments({
            status: "open"
        });

        const completedProjects = await Project.countDocuments({
            status: "completed"
        });

        const proposals = await Proposal.countDocuments();

        res.status(200).json({
            success: true,

            dashboard: {
                totalUsers: users,
                totalClients: clients,
                totalFreelancers: freelancers,
                totalProjects: projects,
                openProjects,
                completedProjects,
                totalProposals: proposals
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET ALL USERS
// ========================================

const getUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// ACTIVATE / DEACTIVATE USER
// ========================================

const toggleUser = async (req, res) => {
    try {

        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = !user.isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User status updated",
            isActive: user.isActive
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// ADMIN REPORTS & ANALYTICS
// ========================================

const getAnalytics = async (req, res) => {
    try {

        // ================================
        // USERS
        // ================================

        const totalUsers =
            await User.countDocuments();

        const totalClients =
            await User.countDocuments({
                role: "client"
            });

        const totalFreelancers =
            await User.countDocuments({
                role: "freelancer"
            });


        // ================================
        // PROJECTS
        // ================================

        const totalProjects =
            await Project.countDocuments();

        const openProjects =
            await Project.countDocuments({
                status: "open"
            });

        const inProgressProjects =
            await Project.countDocuments({
                status: "in_progress"
            });

        const completedProjects =
            await Project.countDocuments({
                status: "completed"
            });

        const cancelledProjects =
            await Project.countDocuments({
                status: "cancelled"
            });


        // ================================
        // PROPOSALS
        // ================================

        const totalProposals =
            await Proposal.countDocuments();

        const acceptedProposals =
            await Proposal.countDocuments({
                status: "accepted"
            });

        const rejectedProposals =
            await Proposal.countDocuments({
                status: "rejected"
            });


        // ================================
        // PAYMENTS
        // ================================

        const totalPayments =
            await Payment.countDocuments();

        const paidPayments =
            await Payment.countDocuments({
                status: "paid"
            });

        const pendingPayments =
            await Payment.countDocuments({
                status: "pending"
            });

        const failedPayments =
            await Payment.countDocuments({
                status: "failed"
            });

        const refundedPayments =
            await Payment.countDocuments({
                status: "refunded"
            });


        // ================================
        // TOTAL REVENUE
        // ================================

        const revenueResult =
            await Payment.aggregate([
                {
                    $match: {
                        status: "paid"
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$amount"
                        }
                    }
                }
            ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        // ================================
        // RESPONSE
        // ================================

        res.status(200).json({

            success: true,

            analytics: {

                users: {
                    total: totalUsers,
                    clients: totalClients,
                    freelancers: totalFreelancers
                },

                projects: {
                    total: totalProjects,
                    open: openProjects,
                    inProgress: inProgressProjects,
                    completed: completedProjects,
                    cancelled: cancelledProjects
                },

                proposals: {
                    total: totalProposals,
                    accepted: acceptedProposals,
                    rejected: rejectedProposals
                },

                payments: {
                    total: totalPayments,
                    paid: paidPayments,
                    pending: pendingPayments,
                    failed: failedPayments,
                    refunded: refundedPayments,
                    revenue: totalRevenue
                }

            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET ALL PROJECTS
// ========================================

const getProjects = async (req, res) => {
    try {

        const projects = await Project.find()
            .populate("client", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// GET SINGLE PROJECT
// ========================================

const getProjectById = async (req, res) => {
    try {

        const project = await Project.findById(
            req.params.id
        ).populate(
            "client",
            "name email phone"
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// DELETE PROJECT
// ========================================

const deleteProject = async (req, res) => {
    try {

        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        await Project.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    dashboard,
    getUsers,
    toggleUser,
    getAnalytics,
    getProjects,
    getProjectById,
    deleteProject
};