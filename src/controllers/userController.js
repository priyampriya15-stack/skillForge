const User = require("../models/User");


// Get Profile
const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select("-password");

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Profile
const updateProfile = async (req, res) => {

    try {

        const {
            name,
            phone,
            bio,
            skills,
            profileImage,
            portfolio
        } = req.body;

        const user = await User.findById(req.user._id);

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (skills !== undefined) user.skills = skills;
        if (profileImage !== undefined)
            user.profileImage = profileImage;

        if (portfolio !== undefined)
            user.portfolio = portfolio;

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
                portfolio: user.portfolio
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};