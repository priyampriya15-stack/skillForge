const User = require("../models/User");


// =====================================================
// GET MY PROFILE
// GET /api/profile/me
// =====================================================

const getMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(
            "GET PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE MY PROFILE
// PUT /api/profile/me
// =====================================================

const updateMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        // =================================================
        // NAME
        // =================================================

        if (req.body.name !== undefined) {
            user.name = String(req.body.name).trim();
        }


        // =================================================
        // PHONE
        // =================================================

        if (req.body.phone !== undefined) {
            user.phone = req.body.phone;
        }


        // =================================================
        // BIO
        // =================================================

        if (req.body.bio !== undefined) {
            user.bio = req.body.bio;
        }


        // =================================================
        // SKILLS
        // =================================================

        if (req.body.skills !== undefined) {

            if (!Array.isArray(req.body.skills)) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be an array"
                });
            }

            user.skills = req.body.skills
                .map(skill => String(skill).trim())
                .filter(skill => skill.length > 0);
        }


        // =================================================
        // EXPERIENCE
        // =================================================

        if (req.body.experience !== undefined) {
            user.experience = req.body.experience;
        }


        // =================================================
        // RATE
        // =================================================

        if (req.body.rate !== undefined) {

            const rate = Number(req.body.rate);

            if (Number.isNaN(rate) || rate < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid rate"
                });
            }

            user.rate = rate;
        }


        // =================================================
        // LOCATION
        // =================================================

        if (req.body.location !== undefined) {
            user.location = req.body.location;
        }


        // =================================================
        // PROFILE IMAGE
        // =================================================

        if (req.body.profileImage !== undefined) {
            user.profileImage = req.body.profileImage;
        }


        // =================================================
        // SAVE
        // =================================================

        const updatedUser = await user.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",

            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                experience: updatedUser.experience,
                rate: updatedUser.rate,
                location: updatedUser.location,
                profileImage: updatedUser.profileImage
            }
        });

    } catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    getMyProfile,
    updateMyProfile
};