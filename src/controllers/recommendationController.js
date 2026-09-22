const OpenAI = require("openai");

const Project = require("../models/Project");
const User = require("../models/User");
const Review = require("../models/Review");


// =========================================================
// OPENAI
// =========================================================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// =========================================================
// HELPER
// =========================================================

const normalizeSkill = (skill) => {
    return String(skill || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
};


const calculateSkillMatch = (projectSkills = [], freelancerSkills = []) => {

    if (
        !Array.isArray(projectSkills) ||
        !Array.isArray(freelancerSkills) ||
        projectSkills.length === 0
    ) {
        return {
            matchedSkills: [],
            missingSkills: [],
            percentage: 0,
        };
    }

    const freelancerSkillMap = new Map();

    freelancerSkills.forEach((skill) => {
        freelancerSkillMap.set(
            normalizeSkill(skill),
            skill
        );
    });

    const matchedSkills = [];
    const missingSkills = [];

    projectSkills.forEach((skill) => {

        const normalized = normalizeSkill(skill);

        if (freelancerSkillMap.has(normalized)) {
            matchedSkills.push(
                freelancerSkillMap.get(normalized)
            );
        } else {
            missingSkills.push(skill);
        }
    });

    const percentage =
        projectSkills.length > 0
            ? Math.round(
                  (matchedSkills.length / projectSkills.length) * 100
              )
            : 0;

    return {
        matchedSkills,
        missingSkills,
        percentage,
    };
};


// =========================================================
// CLIENT
// RECOMMEND FREELANCERS FOR A PROJECT
//
// GET
// /api/recommendations/projects/:projectId/freelancers
// =========================================================

const recommendFreelancers = async (req, res) => {

    try {

        const { projectId } = req.params;

        // -------------------------------------------------
        // 1. Validate project ID
        // -------------------------------------------------

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }


        // -------------------------------------------------
        // 2. Find project
        // -------------------------------------------------

        const project = await Project.findById(projectId)
            .populate(
                "client",
                "name email profileImage"
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }


        // -------------------------------------------------
        // 3. Client ownership check
        // -------------------------------------------------

        if (
            req.user &&
            req.user.role === "client" &&
            project.client &&
            String(project.client._id) !== String(req.user._id)
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to access recommendations for this project",
            });
        }


        // -------------------------------------------------
        // 4. Project skills
        // -------------------------------------------------

        const projectSkills = Array.isArray(project.skills)
            ? project.skills
            : [];


        // -------------------------------------------------
        // 5. Get freelancers
        // -------------------------------------------------

        const freelancers = await User.find({
            role: "freelancer",
        })
            .select(
                "name email profileImage skills rating experience completedJobs verified"
            )
            .lean();


        // -------------------------------------------------
        // 6. Create recommendations
        // -------------------------------------------------

        const recommendations = [];


        for (const freelancer of freelancers) {

            const freelancerSkills =
                Array.isArray(freelancer.skills)
                    ? freelancer.skills
                    : [];


            const skillMatch = calculateSkillMatch(
                projectSkills,
                freelancerSkills
            );


            // ---------------------------------------------
            // Rating
            // ---------------------------------------------

            const rating = Number(
                freelancer.rating || 0
            );

            const ratingScore =
                Math.min(rating / 5, 1) * 20;


            // ---------------------------------------------
            // Experience
            // ---------------------------------------------

            const experience = Number(
                freelancer.experience || 0
            );

            const experienceScore =
                Math.min(experience / 5, 1) * 15;


            // ---------------------------------------------
            // Completed jobs
            // ---------------------------------------------

            const completedJobs = Number(
                freelancer.completedJobs || 0
            );

            const completedJobsScore =
                Math.min(completedJobs / 20, 1) * 10;


            // ---------------------------------------------
            // Profile completeness
            // ---------------------------------------------

            let profileScore = 0;

            if (freelancer.name) {
                profileScore += 1;
            }

            if (freelancer.email) {
                profileScore += 1;
            }

            if (freelancer.profileImage) {
                profileScore += 1;
            }

            if (freelancerSkills.length > 0) {
                profileScore += 1;
            }

            if (freelancer.verified) {
                profileScore += 1;
            }


            // ---------------------------------------------
            // Final score
            // ---------------------------------------------

            const skillScore =
                (skillMatch.percentage / 100) * 50;


            let matchScore =
                skillScore +
                ratingScore +
                experienceScore +
                completedJobsScore +
                profileScore;


            matchScore = Math.round(
                Math.min(matchScore, 100)
            );


            // ---------------------------------------------
            // Reason
            // ---------------------------------------------

            const reasons = [];


            if (skillMatch.matchedSkills.length > 0) {

                reasons.push(
                    `Matches ${skillMatch.matchedSkills.length} required skill${
                        skillMatch.matchedSkills.length > 1
                            ? "s"
                            : ""
                    }`
                );
            }


            if (rating >= 4) {

                reasons.push(
                    `Strong rating of ${rating.toFixed(1)}`
                );
            }


            if (completedJobs > 0) {

                reasons.push(
                    `${completedJobs} completed project${
                        completedJobs > 1
                            ? "s"
                            : ""
                    }`
                );
            }


            if (experience > 0) {

                reasons.push(
                    `${experience} year${
                        experience > 1
                            ? "s"
                            : ""
                    } experience`
                );
            }


            if (freelancer.verified) {

                reasons.push(
                    "Verified freelancer"
                );
            }


            if (reasons.length === 0) {

                reasons.push(
                    "Potential match based on freelancer profile"
                );
            }


            recommendations.push({

                freelancer: {
                    _id: freelancer._id,
                    name: freelancer.name,
                    email: freelancer.email,
                    profileImage:
                        freelancer.profileImage || "",
                    skills: freelancerSkills,
                    rating: rating,
                    experience: experience,
                    completedJobs: completedJobs,
                    verified:
                        freelancer.verified || false,
                },

                matchScore,

                matchedSkills:
                    skillMatch.matchedSkills,

                missingSkills:
                    skillMatch.missingSkills,

                reason:
                    reasons.join(". ") + ".",
            });
        }


        // -------------------------------------------------
        // 7. Sort by score
        // -------------------------------------------------

        recommendations.sort(
            (a, b) =>
                b.matchScore - a.matchScore
        );


        // -------------------------------------------------
        // 8. Return top 10
        // -------------------------------------------------

        const topRecommendations =
            recommendations.slice(0, 10);


        return res.status(200).json({

            success: true,

            project: {
                id: project._id,
                title: project.title,
                description: project.description,
                category: project.category,
                skills: projectSkills,
                budget: project.budget,
                deadline: project.deadline,
                status: project.status,
            },

            count:
                topRecommendations.length,

            recommendations:
                topRecommendations,
        });

    } catch (error) {

        console.error(
            "Recommend Freelancers Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to generate freelancer recommendations",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};


// =========================================================
// FREELANCER
// RECOMMEND PROJECTS FOR LOGGED-IN FREELANCER
//
// GET
// /api/recommendations/freelancer/projects
// =========================================================

const recommendProjectsForFreelancer = async (req, res) => {

    try {

        // -------------------------------------------------
        // 1. Get logged-in freelancer
        // -------------------------------------------------

        const freelancerId =
            req.user?._id;


        if (!freelancerId) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });
        }


        // -------------------------------------------------
        // 2. Find freelancer
        // -------------------------------------------------

        const freelancer =
            await User.findById(freelancerId)
                .select(
                    "name email skills rating experience completedJobs verified"
                )
                .lean();


        if (!freelancer) {

            return res.status(404).json({
                success: false,
                message:
                    "Freelancer not found",
            });
        }


        // -------------------------------------------------
        // 3. Check role
        // -------------------------------------------------

        if (
            freelancer.role &&
            freelancer.role !== "freelancer"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only freelancers can access project recommendations",
            });
        }


        // -------------------------------------------------
        // 4. Freelancer skills
        // -------------------------------------------------

        const freelancerSkills =
            Array.isArray(freelancer.skills)
                ? freelancer.skills
                : [];


        // -------------------------------------------------
        // 5. Get open / active projects
        // -------------------------------------------------

        const projects =
            await Project.find({
                status: {
                    $in: [
                        "open",
                        "active",
                    ],
                },
            })
                .populate(
                    "client",
                    "name email profileImage"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(50)
                .lean();


        // -------------------------------------------------
        // 6. Get freelancer reviews
        // -------------------------------------------------

        let averageRating =
            Number(freelancer.rating || 0);

        try {

            const reviews =
                await Review.find({
                    freelancer:
                        freelancerId,
                }).lean();


            if (
                reviews.length > 0
            ) {

                const totalRating =
                    reviews.reduce(
                        (sum, review) =>
                            sum +
                            Number(
                                review.rating || 0
                            ),
                        0
                    );


                averageRating =
                    totalRating /
                    reviews.length;
            }

        } catch (reviewError) {

            console.log(
                "Review lookup skipped:",
                reviewError.message
            );
        }


        // -------------------------------------------------
        // 7. Completed jobs
        // -------------------------------------------------

        let completedJobs =
            Number(
                freelancer.completedJobs || 0
            );


        // -------------------------------------------------
        // 8. Remove already applied projects
        // -------------------------------------------------

        let appliedProjectIds = [];

        try {

            const appliedProjects =
                await Project.find({
                    "applications.freelancer":
                        freelancerId,
                })
                    .select("_id")
                    .lean();


            appliedProjectIds =
                appliedProjects.map(
                    (project) =>
                        String(project._id)
                );

        } catch (applicationError) {

            console.log(
                "Application lookup skipped:",
                applicationError.message
            );
        }


        // -------------------------------------------------
        // 9. Filter projects
        // -------------------------------------------------

        const availableProjects =
            projects.filter(
                (project) =>
                    !appliedProjectIds.includes(
                        String(project._id)
                    )
            );


        // -------------------------------------------------
        // 10. Prepare project data for AI
        // -------------------------------------------------

        const projectData =
            availableProjects.map(
                (project) => ({

                    id: String(
                        project._id
                    ),

                    title:
                        project.title || "",

                    description:
                        project.description || "",

                    category:
                        project.category || "",

                    skills:
                        Array.isArray(
                            project.skills
                        )
                            ? project.skills
                            : [],

                    budget:
                        Number(
                            project.budget || 0
                        ),

                    deadline:
                        project.deadline || null,
                })
            );


        // -------------------------------------------------
        // 11. Freelancer data
        // -------------------------------------------------

        const freelancerData = {

            id: String(
                freelancer._id
            ),

            name:
                freelancer.name || "",

            skills:
                freelancerSkills,

            rating:
                Number(
                    averageRating || 0
                ),

            completedJobs,

            experience:
                Number(
                    freelancer.experience || 0
                ),

            verified:
                freelancer.verified || false,
        };


        // -------------------------------------------------
        // 12. No projects
        // -------------------------------------------------

        if (
            projectData.length === 0
        ) {

            return res.status(200).json({

                success: true,

                freelancer:
                    freelancerData,

                count: 0,

                recommendations: [],
            });
        }


        // =================================================
        // 13. OPENAI RECOMMENDATION
        // =================================================

        const prompt = `
You are an AI project recommendation engine for SkillForge.

Your job is to recommend projects to a freelancer.

Freelancer:
${JSON.stringify(
    freelancerData,
    null,
    2
)}

Available projects:
${JSON.stringify(
    projectData,
    null,
    2
)}

Evaluate each project using:

1. Skill compatibility
2. Project category
3. Project description
4. Freelancer experience
5. Freelancer rating
6. Completed jobs
7. Overall relevance

Return the best matching projects.

Match score must be between 0 and 100.

matchedSkills must contain skills that appear in both
the freelancer skills and project skills.

missingSkills must contain project skills that the freelancer
does not have.

Keep the reason short and useful.
`;


        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                input:
                    prompt,

                store: false,

                text: {

                    format: {

                        type:
                            "json_schema",

                        name:
                            "project_recommendations",

                        strict:
                            true,

                        schema: {

                            type:
                                "object",

                            properties: {

                                recommendations: {

                                    type:
                                        "array",

                                    items: {

                                        type:
                                            "object",

                                        properties: {

                                            projectId: {
                                                type:
                                                    "string",
                                            },

                                            matchScore: {
                                                type:
                                                    "number",
                                            },

                                            reason: {
                                                type:
                                                    "string",
                                            },

                                            matchedSkills: {
                                                type:
                                                    "array",

                                                items: {
                                                    type:
                                                        "string",
                                                },
                                            },

                                            missingSkills: {
                                                type:
                                                    "array",

                                                items: {
                                                    type:
                                                        "string",
                                                },
                                            },
                                        },

                                        required: [
                                            "projectId",
                                            "matchScore",
                                            "reason",
                                            "matchedSkills",
                                            "missingSkills",
                                        ],

                                        additionalProperties:
                                            false,
                                    },
                                },
                            },

                            required: [
                                "recommendations",
                            ],

                            additionalProperties:
                                false,
                        },
                    },
                },
            });


        // -------------------------------------------------
        // 14. Parse AI response
        // -------------------------------------------------

        let aiResult;


        try {

            aiResult =
                JSON.parse(
                    response.output_text
                );

        } catch (parseError) {

            console.error(
                "AI JSON Parse Error:",
                parseError
            );

            return res.status(500).json({

                success: false,

                message:
                    "AI returned an invalid recommendation response",
            });
        }


        const aiRecommendations =
            Array.isArray(
                aiResult.recommendations
            )
                ? aiResult.recommendations
                : [];


        // -------------------------------------------------
        // 15. Merge AI + database data
        // -------------------------------------------------

        const recommendations =
            aiRecommendations
                .map(
                    (recommendation) => {

                        const project =
                            availableProjects.find(
                                (item) =>
                                    String(
                                        item._id
                                    ) ===
                                    String(
                                        recommendation.projectId
                                    )
                            );


                        if (!project) {
                            return null;
                        }


                        const matchScore =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    Math.round(
                                        Number(
                                            recommendation.matchScore ||
                                                0
                                        )
                                    )
                                )
                            );


                        return {

                            id:
                                project._id,

                            title:
                                project.title,

                            description:
                                project.description,

                            category:
                                project.category,

                            skills:
                                Array.isArray(
                                    project.skills
                                )
                                    ? project.skills
                                    : [],

                            budget:
                                project.budget,

                            deadline:
                                project.deadline,

                            status:
                                project.status,

                            client:
                                project.client || null,

                            matchScore,

                            matchedSkills:
                                Array.isArray(
                                    recommendation.matchedSkills
                                )
                                    ? recommendation.matchedSkills
                                    : [],

                            missingSkills:
                                Array.isArray(
                                    recommendation.missingSkills
                                )
                                    ? recommendation.missingSkills
                                    : [],

                            aiReason:
                                recommendation.reason ||
                                "This project matches your profile.",
                        };
                    }
                )
                .filter(Boolean);


        // -------------------------------------------------
        // 16. Sort
        // -------------------------------------------------

        recommendations.sort(
            (a, b) =>
                b.matchScore -
                a.matchScore
        );


        // -------------------------------------------------
        // 17. Return top 10
        // -------------------------------------------------

        const topRecommendations =
            recommendations.slice(
                0,
                10
            );


        return res.status(200).json({

            success: true,

            freelancer: {

                id:
                    freelancer._id,

                name:
                    freelancer.name,

                skills:
                    freelancerSkills,

                rating:
                    Number(
                        averageRating || 0
                    ),

                completedJobs,
            },

            count:
                topRecommendations.length,

            recommendations:
                topRecommendations,
        });

    } catch (error) {

        console.error(
            "Recommend Projects Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to generate project recommendations",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
    recommendFreelancers,
    recommendProjectsForFreelancer,
};