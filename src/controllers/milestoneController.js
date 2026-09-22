const mongoose = require("mongoose");
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");


// =====================================================
// CREATE MILESTONE
// POST /api/milestones/project/:projectId
// =====================================================

const createMilestone = async (req, res) => {
    try {
        const {
            title,
            description,
            amount,
            dueDate
        } = req.body;

        const { projectId } = req.params;

        console.log("======================================");
        console.log("CREATE MILESTONE");
        console.log("Project ID:", projectId);
        console.log("User ID:", req.user?._id);
        console.log("Request Body:", req.body);
        console.log("======================================");


        // -------------------------------------------------
        // Validate Project ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }


        // -------------------------------------------------
        // Validate Required Fields
        // -------------------------------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Milestone title is required"
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            amount === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Milestone amount is required"
            });
        }

        if (!dueDate) {
            return res.status(400).json({
                success: false,
                message: "Milestone due date is required"
            });
        }


        // -------------------------------------------------
        // Find Project
        // -------------------------------------------------

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }


        // -------------------------------------------------
        // Check Logged-in User
        // -------------------------------------------------

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }


        // -------------------------------------------------
        // Client Permission
        // -------------------------------------------------

        if (
            !project.client ||
            project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to create a milestone for this project"
            });
        }


        // -------------------------------------------------
        // Create Milestone
        // -------------------------------------------------

        const milestone = await Milestone.create({
            project: project._id,
            title: title.trim(),
            description: description || "",
            amount: Number(amount),
            dueDate
        });


        console.log("Milestone created successfully");
        console.log("Milestone ID:", milestone._id);
        console.log("======================================");


        return res.status(201).json({
            success: true,
            message: "Milestone created successfully",
            milestone
        });

    } catch (error) {

        console.error("======================================");
        console.error("CREATE MILESTONE ERROR");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR STACK:", error.stack);
        console.error("======================================");


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// =====================================================
// GET MILESTONES BY PROJECT
// GET /api/milestones/project/:projectId
// =====================================================

const getMilestones = async (req, res) => {
    try {
        const { projectId } = req.params;

        console.log("======================================");
        console.log("GET MILESTONES");
        console.log("Requested Project ID:", projectId);
        console.log("User ID:", req.user?._id);
        console.log("======================================");


        // -------------------------------------------------
        // Validate Project ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(projectId)) {

            console.log(
                "INVALID PROJECT ID:",
                projectId
            );

            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }


        // -------------------------------------------------
        // Check Project Exists
        // -------------------------------------------------

        const project = await Project.findById(projectId);

        console.log(
            "PROJECT FOUND:",
            !!project
        );


        if (!project) {

            console.log(
                "PROJECT NOT FOUND:",
                projectId
            );

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }


        // -------------------------------------------------
        // Get Milestones
        // -------------------------------------------------

        const milestones = await Milestone.find({
            project: project._id
        })
            .sort({
                dueDate: 1
            });


        console.log(
            "MILESTONES FOUND:",
            milestones.length
        );

        console.log("======================================");


        return res.status(200).json({
            success: true,
            count: milestones.length,
            milestones
        });

    } catch (error) {

        console.error("======================================");
        console.error("GET MILESTONES ERROR");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR STACK:", error.stack);
        console.error("======================================");


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// =====================================================
// UPDATE MILESTONE
// PUT /api/milestones/:id
// =====================================================

const updateMilestone = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("======================================");
        console.log("UPDATE MILESTONE");
        console.log("Milestone ID:", id);
        console.log("User ID:", req.user?._id);
        console.log("Request Body:", req.body);
        console.log("======================================");


        // -------------------------------------------------
        // Validate Milestone ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid milestone ID"
            });
        }


        // -------------------------------------------------
        // Find Milestone
        // -------------------------------------------------

        const milestone = await Milestone.findById(id)
            .populate("project");


        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }


        // -------------------------------------------------
        // Check Project
        // -------------------------------------------------

        const project = milestone.project;


        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Associated project not found"
            });
        }


        // -------------------------------------------------
        // Check Logged-in User
        // -------------------------------------------------

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }


        // -------------------------------------------------
        // Client Permission
        // -------------------------------------------------

        const isClient =
            project.client &&
            project.client.toString() ===
            req.user._id.toString();


        // -------------------------------------------------
        // Freelancer Permission
        // -------------------------------------------------

        const isFreelancer =
            project.selectedFreelancer &&
            project.selectedFreelancer.toString() ===
            req.user._id.toString();


        // -------------------------------------------------
        // Permission Check
        // -------------------------------------------------

        if (!isClient && !isFreelancer) {

            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this milestone"
            });
        }


        // -------------------------------------------------
        // Update Allowed Fields
        // -------------------------------------------------

        if (
            req.body.title !== undefined
        ) {
            milestone.title =
                req.body.title;
        }


        if (
            req.body.description !== undefined
        ) {
            milestone.description =
                req.body.description;
        }


        if (
            req.body.amount !== undefined
        ) {
            milestone.amount =
                Number(req.body.amount);
        }


        if (
            req.body.dueDate !== undefined
        ) {
            milestone.dueDate =
                req.body.dueDate;
        }


        if (
            req.body.status !== undefined
        ) {
            milestone.status =
                req.body.status;
        }


        if (
            req.body.paymentStatus !== undefined
        ) {
            milestone.paymentStatus =
                req.body.paymentStatus;
        }


        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        await milestone.save();


        console.log(
            "MILESTONE UPDATED:",
            milestone._id
        );

        console.log("======================================");


        return res.status(200).json({
            success: true,
            message: "Milestone updated successfully",
            milestone
        });

    } catch (error) {

        console.error("======================================");
        console.error("UPDATE MILESTONE ERROR");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("ERROR STACK:", error.stack);
        console.error("======================================");


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    createMilestone,
    getMilestones,
    updateMilestone
};