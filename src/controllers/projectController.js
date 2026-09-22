const mongoose = require("mongoose");
const Project = require("../models/Project");

// =====================================================
// CREATE PROJECT
// POST /api/projects
// =====================================================
const createProject = async (req, res) => {
    try {
        // =====================================================
        // DEBUG - CHECK FRONTEND REQUEST BODY
        // =====================================================
        console.log("======================================");
        console.log("CREATE PROJECT REQUEST BODY:");
        console.log(req.body);
        console.log("======================================");

        const {
            title,
            description,
            skills,
            category,
            budget,
            deadline
        } = req.body;

        // =====================================================
        // VALIDATE REQUIRED FIELDS
        // =====================================================
        if (
            !title ||
            !title.trim() ||
            !description ||
            !description.trim() ||
            !category ||
            !category.trim() ||
            budget === undefined ||
            budget === null ||
            budget === "" ||
            !deadline
        ) {
            console.log("PROJECT VALIDATION FAILED:", {
                title,
                description,
                skills,
                category,
                budget,
                deadline
            });

            return res.status(400).json({
                success: false,
                message: "Title, description, category, budget and deadline are required"
            });
        }

        // =====================================================
        // VALIDATE SKILLS
        // =====================================================
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one skill is required"
            });
        }

        // =====================================================
        // CLEAN SKILLS
        // =====================================================
        const cleanedSkills = skills
            .map((skill) => String(skill).trim())
            .filter(Boolean);

        if (cleanedSkills.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one valid skill is required"
            });
        }

        // =====================================================
        // VALIDATE BUDGET
        // =====================================================
        const numericBudget = Number(budget);

        if (Number.isNaN(numericBudget) || numericBudget <= 0) {
            return res.status(400).json({
                success: false,
                message: "Budget must be greater than 0"
            });
        }

        // =====================================================
        // VALIDATE DEADLINE
        // =====================================================
        const deadlineDate = new Date(deadline);

        if (Number.isNaN(deadlineDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid deadline"
            });
        }

        // =====================================================
        // CHECK AUTHENTICATED USER
        // =====================================================
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        // =====================================================
        // CREATE PROJECT
        // =====================================================
        const project = await Project.create({
            client: req.user._id,

            title: title.trim(),

            description: description.trim(),

            skills: cleanedSkills,

            category: category.trim(),

            budget: numericBudget,

            deadline: deadlineDate,

            status: "open"
        });

        console.log("PROJECT CREATED SUCCESSFULLY:");
        console.log(project);

        // =====================================================
        // RESPONSE
        // =====================================================
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
// GET MY PROJECTS
// GET /api/projects/my-projects
// =====================================================
const getMyProjects = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const projects = await Project.find({
            client: userId
        })
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
        console.log("Get My Projects Error:", error);

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

        // Project not found
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

        // Find project
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
                message:
                    "You do not have permission to update this project"
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

        // Update title
        if (title !== undefined) {
            project.title = title.trim();
        }

        // Update description
        if (description !== undefined) {
            project.description = description.trim();
        }

        // Update skills
        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be an array"
                });
            }

            project.skills = skills
                .map((skill) => String(skill).trim())
                .filter(Boolean);
        }

        // Update category
        if (category !== undefined) {
            project.category = category.trim();
        }

        // Update budget
        if (budget !== undefined) {
            const numericBudget = Number(budget);

            if (
                Number.isNaN(numericBudget) ||
                numericBudget <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Budget must be greater than 0"
                });
            }

            project.budget = numericBudget;
        }

        // Update deadline
        if (deadline !== undefined) {
            const deadlineDate = new Date(deadline);

            if (Number.isNaN(deadlineDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid deadline"
                });
            }

            project.deadline = deadlineDate;
        }

        // Update status
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

        // Find project
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
                message:
                    "You do not have permission to delete this project"
            });
        }

        // Delete project
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
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject
};