const Proposal = require("../models/Proposal");
const Project = require("../models/Project");


// Submit proposal
const submitProposal = async (req, res) => {

    try {

        const {
            coverLetter,
            proposedAmount,
            deliveryDays
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

        if (project.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "Project is not open"
            });
        }

        const existingProposal =
            await Proposal.findOne({
                project: project._id,
                freelancer: req.user._id
            });

        if (existingProposal) {
            return res.status(400).json({
                success: false,
                message: "Proposal already submitted"
            });
        }

        const proposal = await Proposal.create({
            project: project._id,
            freelancer: req.user._id,
            coverLetter,
            proposedAmount,
            deliveryDays
        });

        res.status(201).json({
            success: true,
            message: "Proposal submitted successfully",
            proposal
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Client views proposals
const getProjectProposals = async (req, res) => {

    try {

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

        const proposals = await Proposal.find({
            project: project._id
        })
            .populate(
                "freelancer",
                "name email skills bio profileImage portfolio"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: proposals.length,
            proposals
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Shortlist
const shortlistProposal = async (req, res) => {

    try {

        const proposal = await Proposal.findById(
            req.params.id
        ).populate("project");

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        if (
            proposal.project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }

        proposal.status = "shortlisted";

        await proposal.save();

        res.status(200).json({
            success: true,
            message: "Freelancer shortlisted",
            proposal
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Accept proposal
const acceptProposal = async (req, res) => {

    try {

        const proposal = await Proposal.findById(
            req.params.id
        ).populate("project");

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found"
            });
        }

        if (
            proposal.project.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }

        proposal.status = "accepted";

        await proposal.save();

        await Project.findByIdAndUpdate(
            proposal.project._id,
            {
                selectedFreelancer:
                    proposal.freelancer,
                status: "in_progress"
            }
        );

        res.status(200).json({
            success: true,
            message: "Proposal accepted successfully",
            proposal
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    submitProposal,
    getProjectProposals,
    shortlistProposal,
    acceptProposal
};