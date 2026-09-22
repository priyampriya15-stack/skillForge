const User = require("../models/User");
const Review = require("../models/Review");
const Project = require("../models/Project");

// =====================================================
// GET LOGGED-IN USER PROFILE
// =====================================================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// UPDATE PROFILE
// =====================================================
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            bio,
            skills,
            profileImage,
            portfolio,
            experience,
            rate,
            location
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Basic information
        if (name !== undefined) {
            user.name = String(name).trim();
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (bio !== undefined) {
            user.bio = String(bio).trim();
        }

        // Skills
        if (skills !== undefined) {
            user.skills = Array.isArray(skills)
                ? skills
                : [];
        }

        // Profile image
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        // Portfolio
        if (portfolio !== undefined) {
            user.portfolio = Array.isArray(portfolio)
                ? portfolio
                : [];
        }

        // Freelancer professional information
        if (experience !== undefined) {
            user.experience = experience;
        }

        if (rate !== undefined) {
            user.rate =
                rate === null || rate === ""
                    ? null
                    : Number(rate);
        }

        if (location !== undefined) {
            user.location = String(location).trim();
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                bio: user.bio,
                skills: user.skills,
                profileImage: user.profileImage,
                portfolio: user.portfolio,
                experience: user.experience,
                rate: user.rate,
                location: user.location
            }
        });

    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET ALL FREELANCERS
// =====================================================
const getFreelancers = async (req, res) => {
    try {
        const {
            q = "",
            skill = "",
            minRating = ""
        } = req.query;

        const query = {
            role: "freelancer",
            isActive: true
        };

        // Search by name / bio / skills
        if (q.trim()) {
            const searchRegex = new RegExp(
                q.trim(),
                "i"
            );

            query.$or = [
                { name: searchRegex },
                { bio: searchRegex },
                { skills: searchRegex }
            ];
        }

        // Skill filter
        if (
            skill &&
            skill !== "All"
        ) {
            query.skills = {
                $regex: new RegExp(
                    `^${skill}$`,
                    "i"
                )
            };
        }

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        // Get rating + completed projects
        const freelancers = await Promise.all(
            users.map(async (user) => {

                // Reviews
                const reviews = await Review.find({
                    reviewee: user._id
                }).select("rating");

                const rating =
                    reviews.length > 0
                        ? reviews.reduce(
                            (sum, review) =>
                                sum +
                                Number(
                                    review.rating || 0
                                ),
                            0
                        ) / reviews.length
                        : 0;

                // Completed projects
                const completedJobs =
                    await Project.countDocuments({
                        selectedFreelancer:
                            user._id,
                        status: "completed"
                    });

                const reviewCount =
                    reviews.length;

                return {
                    id: user._id,

                    name:
                        user.name || "",

                    email:
                        user.email || "",

                    role:
                        user.role,

                    bio:
                        user.bio || "",

                    skills:
                        user.skills || [],

                    profileImage:
                        user.profileImage || "",

                    portfolio:
                        user.portfolio || [],

                    rating:
                        Number(
                            rating.toFixed(1)
                        ),

                    reviews:
                        reviewCount,

                    completedJobs,

                    experience:
                        user.experience || "",

                    rate:
                        user.rate !== undefined
                            ? user.rate
                            : null,

                    location:
                        user.location || "",

                    isVerified:
                        Boolean(
                            user.isVerified ||
                            user.verified
                        ),

                    isAvailable:
                        typeof user.isAvailable ===
                        "boolean"
                            ? user.isAvailable
                            : null
                };
            })
        );

        // Rating filter
        const filteredFreelancers =
            minRating &&
            minRating !== "All Ratings"
                ? freelancers.filter(
                    (freelancer) =>
                        freelancer.rating >=
                        Number(minRating)
                )
                : freelancers;

        res.status(200).json({
            success: true,
            count:
                filteredFreelancers.length,
            freelancers:
                filteredFreelancers
        });

    } catch (error) {
        console.error(
            "Get freelancers error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// FREELANCER STATISTICS
// =====================================================
const getFreelancerStats = async (
    req,
    res
) => {
    try {

        // Total active freelancers
        const freelancerCount =
            await User.countDocuments({
                role: "freelancer",
                isActive: true
            });

        // Completed jobs
        const completedJobs =
            await Project.countDocuments({
                selectedFreelancer: {
                    $ne: null
                },
                status: "completed"
            });

        // Freelancer reviews
        const freelancerIds =
            await User.find({
                role: "freelancer"
            }).distinct("_id");

        const freelancerReviews =
            await Review.find({
                reviewee: {
                    $in: freelancerIds
                }
            }).select("rating");

        const averageRating =
            freelancerReviews.length > 0
                ? freelancerReviews.reduce(
                    (sum, review) =>
                        sum +
                        Number(
                            review.rating || 0
                        ),
                    0
                ) /
                freelancerReviews.length
                : 0;

        const totalFreelancerReviews =
            freelancerReviews.length;

        res.status(200).json({
            success: true,

            stats: {
                freelancers:
                    freelancerCount,

                completedJobs,

                averageRating:
                    Number(
                        averageRating.toFixed(1)
                    ),

                reviews:
                    totalFreelancerReviews
            }
        });

    } catch (error) {
        console.error(
            "Freelancer stats error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET CLIENT DASHBOARD
// =====================================================
const getClientDashboard = async (req, res) => {
    try {

        // =================================================
        // GET LOGGED-IN USER ID
        // =================================================
        const clientId = req.user._id;

        console.log(
            "======================================"
        );

        console.log(
            "CLIENT DASHBOARD REQUEST"
        );

        console.log(
            "User ID:",
            clientId
        );

        console.log(
            "User from token:",
            req.user
        );


        // =================================================
        // GET USER FROM DATABASE
        // =================================================
        const client = await User.findById(clientId)
            .select("-password");

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }


        // =================================================
        // DEBUG USER ROLE
        // =================================================
        console.log(
            "Database User:",
            {
                id: client._id,
                name: client.name,
                email: client.email,
                role: client.role
            }
        );


        // =================================================
        // CHECK CLIENT ROLE
        // =================================================
        if (client.role !== "client") {

            console.log(
                "❌ CLIENT ROLE CHECK FAILED"
            );

            console.log(
                "Expected role: client"
            );

            console.log(
                "Actual role:",
                client.role
            );

            return res.status(403).json({
                success: false,
                message: "Only clients can access this dashboard",
                role: client.role
            });
        }


        console.log(
            "✅ CLIENT ROLE CHECK PASSED"
        );


        // =================================================
        // GET CLIENT PROJECTS
        // =================================================
        const projects = await Project.find({
            client: clientId
        })
            .sort({
                createdAt: -1
            })
            .lean();


        console.log(
            "Client Projects:",
            projects.length
        );


        // =================================================
        // PROJECT STATISTICS
        // =================================================
        const totalProjects =
            projects.length;


        const activeProjects =
            projects.filter(
                (project) =>
                    project.status === "open" ||
                    project.status === "active" ||
                    project.status === "in-progress"
            ).length;


        const completedProjects =
            projects.filter(
                (project) =>
                    project.status === "completed"
            ).length;


        const pendingProjects =
            projects.filter(
                (project) =>
                    project.status === "pending"
            ).length;


        // =================================================
        // TOTAL BUDGET
        // =================================================
        const totalBudget =
            projects.reduce(
                (total, project) =>
                    total +
                    Number(
                        project.budget || 0
                    ),
                0
            );


        // =================================================
        // RECENT PROJECTS
        // =================================================
        const recentProjects =
            projects
                .slice(0, 5)
                .map((project) => ({
                    id: project._id,

                    title:
                        project.title || "",

                    description:
                        project.description || "",

                    category:
                        project.category || "",

                    budget:
                        Number(
                            project.budget || 0
                        ),

                    deadline:
                        project.deadline || null,

                    status:
                        project.status || "open",

                    skills:
                        project.skills || [],

                    selectedFreelancer:
                        project.selectedFreelancer ||
                        null,

                    createdAt:
                        project.createdAt || null
                }));


        // =================================================
        // FINAL RESPONSE
        // =================================================
        res.status(200).json({
            success: true,

            user: {
                id: client._id,

                name:
                    client.name || "",

                email:
                    client.email || "",

                role:
                    client.role,

                profileImage:
                    client.profileImage || ""
            },

            stats: {
                totalProjects,

                activeProjects,

                completedProjects,

                pendingProjects,

                totalBudget
            },

            projects:
                recentProjects
        });


        console.log(
            "✅ CLIENT DASHBOARD SUCCESS"
        );

        console.log(
            "======================================"
        );

    } catch (error) {

        console.error(
            "❌ Get client dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    getProfile,
    updateProfile,
    getFreelancers,
    getFreelancerStats,
    getClientDashboard
};