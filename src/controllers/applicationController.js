const Application = require("../models/Application");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// =====================================================
// APPLY FOR PROJECT - FREELANCER
// =====================================================
const applyProject = async (req, res, next) => {
    try {
        const { proposal, bidAmount } = req.body;
        const { projectId } = req.params;

        // Validate input
        if (!proposal || !bidAmount) {
            return res.status(400).json({
                success: false,
                message: "Proposal and bid amount are required"
            });
        }

        // Find project
        const project = await Project.findById(projectId)
            .populate("client", "name email");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // Check project status
        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Project is not open for applications"
            });
        }

        // Freelancer cannot apply to own project
        if (
            project.client &&
            project.client._id.toString() ===
            req.user._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot apply to your own project"
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            project: projectId,
            freelancer: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You already applied for this project"
            });
        }

        // Create application
        const application = await Application.create({
            project: projectId,
            freelancer: req.user._id,
            proposal: proposal.trim(),
            bidAmount: Number(bidAmount),
            status: "pending"
        });

        // =================================================
        // NOTIFICATION TO CLIENT
        // =================================================
        if (project.client) {
            await Notification.create({
                user: project.client._id,
                message: `A freelancer has applied for your project "${project.title}".`,
                type: "proposal"
            });
        }

        // =================================================
        // EMAIL TO CLIENT
        // =================================================
        if (project.client && project.client.email) {
            await sendEmail(
                project.client.email,
                "New Application Received",
                `Hello ${project.client.name},

A freelancer has applied for your project.

Project: ${project.title}

Bid Amount: ₹${bidAmount}

Proposal:
${proposal}

Please login to your Freelance Project Marketplace account to review the application.

Thank you,
Freelance Project Marketplace`
            );
        }

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// GET MY APPLICATIONS - FREELANCER
// =====================================================
const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({
            freelancer: req.user._id
        })
            .populate({
                path: "project",
                populate: {
                    path: "client",
                    select: "name email"
                }
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// GET PROJECT APPLICATIONS - CLIENT
// =====================================================
const getProjectApplications = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Find project
        const project = await Project.findById(projectId);

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
                message: "Only project owner can view applications"
            });
        }

        // Get applications
        const applications = await Application.find({
            project: projectId
        })
            .populate(
                "freelancer",
                "name email skills bio profileImage"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// ACCEPT / REJECT APPLICATION - CLIENT
// =====================================================
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // =================================================
        // VALIDATE STATUS
        // =================================================
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be accepted or rejected"
            });
        }

        // =================================================
        // FIND APPLICATION
        // =================================================
        const application = await Application.findById(id)
            .populate("project")
            .populate(
                "freelancer",
                "name email"
            );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // =================================================
        // CHECK PROJECT
        // =================================================
        if (!application.project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        // =================================================
        // CHECK PROJECT OWNER
        // =================================================
        if (
            application.project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Only the project owner can update this application"
            });
        }

        // =================================================
        // ACCEPT APPLICATION
        // =================================================
        if (status === "accepted") {

            // Check project is still available
            if (
                application.project.status !== "open"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "This project is no longer open"
                });
            }

            // Update application
            application.status = "accepted";
            await application.save();

            // =================================================
            // UPDATE PROJECT
            // =================================================
            await Project.findByIdAndUpdate(
                application.project._id,
                {
                    status: "in_progress",
                    selectedFreelancer:
                        application.freelancer._id
                }
            );

            // =================================================
            // REJECT OTHER APPLICATIONS
            // =================================================
            await Application.updateMany(
                {
                    project: application.project._id,
                    _id: {
                        $ne: application._id
                    }
                },
                {
                    $set: {
                        status: "rejected"
                    }
                }
            );

        } else {

            // =================================================
            // REJECT APPLICATION
            // =================================================
            application.status = "rejected";
            await application.save();
        }

        // =================================================
        // NOTIFICATION TO FREELANCER
        // =================================================
        await Notification.create({
            user: application.freelancer._id,

            message:
                status === "accepted"
                    ? `Congratulations! Your application for "${application.project.title}" has been accepted.`
                    : `Your application for "${application.project.title}" has been rejected.`,

            type:
                status === "accepted"
                    ? "project"
                    : "proposal"
        });

        // =================================================
        // EMAIL TO FREELANCER
        // =================================================
        if (
            application.freelancer &&
            application.freelancer.email
        ) {
            await sendEmail(
                application.freelancer.email,

                `Application ${status}`,

                `Hello ${application.freelancer.name},

Your application for the project "${application.project.title}" has been ${status}.

Project: ${application.project.title}

Application Status: ${status}

${
    status === "accepted"
        ? `Congratulations! 🎉

The client has selected you for this project.

The project is now in progress.`
        : `Thank you for your interest in this project.

Unfortunately, your application was not selected this time.`
}

Thank you,
Freelance Project Marketplace`
            );
        }

        // =================================================
        // FINAL RESPONSE
        // =================================================
        return res.status(200).json({
            success: true,
            message:
                status === "accepted"
                    ? "Application accepted successfully"
                    : "Application rejected successfully",

            application: {
                _id: application._id,
                project: application.project._id,
                freelancer: application.freelancer._id,
                proposal: application.proposal,
                bidAmount: application.bidAmount,
                status: application.status
            }
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    applyProject,
    getMyApplications,
    getProjectApplications,
    updateApplicationStatus
};