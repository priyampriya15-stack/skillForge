const Milestone = require("../models/Milestone");
const Project = require("../models/Project");


// Create milestone
const createMilestone = async (req, res) => {

    try {

        const {
            title,
            description,
            amount,
            dueDate
        } = req.body;

        const project = await Project.findById(
            req.params.projectId
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        if (
            project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }

        const milestone = await Milestone.create({
            project: project._id,
            title,
            description,
            amount,
            dueDate
        });

        res.status(201).json({
            success: true,
            message: "Milestone created successfully",
            milestone
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get milestones
const getMilestones = async (req, res) => {

    try {

        const milestones = await Milestone.find({
            project: req.params.projectId
        }).sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            milestones
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update milestone
const updateMilestone = async (req, res) => {

    try {

        const milestone = await Milestone.findById(
            req.params.id
        ).populate("project");

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        const project = milestone.project;

        const isClient =
            project.client.toString() ===
            req.user._id.toString();

        const isFreelancer =
            project.selectedFreelancer &&
            project.selectedFreelancer.toString() ===
            req.user._id.toString();

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }

        Object.assign(milestone, req.body);

        await milestone.save();

        res.status(200).json({
            success: true,
            message: "Milestone updated successfully",
            milestone
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createMilestone,
    getMilestones,
    updateMilestone
};