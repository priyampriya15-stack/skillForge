const mongoose = require("mongoose");
const Project = require("../models/Project");

// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            skills,
            category,
            budget,
            deadline
        } = req.body;

        // Validate fields
        if (
            !title ||
            !description ||
            !skills ||
            !category ||
            !budget ||
            !deadline
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const project = await Project.create({
            client: req.user._id,
            title,
            description,
            skills,
            category,
            budget,
            deadline
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.log("Create Project Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET ALL PROJECTS
// GET /api/projects
// =====================================================
const getProjects = async (req, res) => {
    try {
        const {
            search,
            category,
            skill,
            status
        } = req.query;

        let filter = {};

        // Default status = open
        filter.status = status || "open";

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Skill filter
        if (skill) {
            filter.skills = {
                $in: [skill]
            };
        }

        // Search filter
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const projects = await Project.find(filter)
            .populate(
                "client",
                "name email profileImage"
            )
            .populate(
                "selectedFreelancer",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });

    } catch (error) {
        console.log("Get Projects Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// =====================================================
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Requested Project ID:", id);

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(id)
            .populate(
                "client",
                "name email profileImage"
            )
            .populate(
                "selectedFreelancer",
                "name email"
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            project
        });

    } catch (error) {
        console.log("Get Project By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// UPDATE PROJECT
// PUT /api/projects/:id
// =====================================================
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check project owner
        if (
            project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this project"
            });
        }

        const {
            title,
            description,
            skills,
            category,
            budget,
            deadline,
            status
        } = req.body;

        // Update only provided fields
        if (title !== undefined) {
            project.title = title;
        }

        if (description !== undefined) {
            project.description = description;
        }

        if (skills !== undefined) {
            project.skills = skills;
        }

        if (category !== undefined) {
            project.category = category;
        }

        if (budget !== undefined) {
            project.budget = budget;
        }

        if (deadline !== undefined) {
            project.deadline = deadline;
        }

        if (status !== undefined) {
            project.status = status;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        console.log("Update Project Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// DELETE PROJECT
// DELETE /api/projects/:id
// =====================================================
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID"
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check project owner
        if (
            project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this project"
            });
        }

        await project.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.log("Delete Project Error:", error);

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
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};