const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // =====================================================
        // BASIC USER INFORMATION
        // =====================================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },


        // =====================================================
        // USER ROLE
        // =====================================================

        role: {
            type: String,
            enum: ["client", "freelancer", "admin"],
            default: "freelancer"
        },


        // =====================================================
        // CONTACT INFORMATION
        // =====================================================

        phone: {
            type: String,
            default: ""
        },


        // =====================================================
        // PROFILE INFORMATION
        // =====================================================

        bio: {
            type: String,
            default: "",
            trim: true
        },

        // Freelancer skills
        skills: {
            type: [String],
            default: []
        },

        profileImage: {
            type: String,
            default: ""
        },


        // =====================================================
        // FREELANCER PROFESSIONAL INFORMATION
        // =====================================================

        experience: {
            type: String,
            default: ""
        },

        rate: {
            type: Number,
            default: null,
            min: 0
        },

        location: {
            type: String,
            default: "",
            trim: true
        },


        // =====================================================
        // PORTFOLIO
        // =====================================================

        portfolio: [
            {
                title: {
                    type: String,
                    default: "",
                    trim: true
                },

                url: {
                    type: String,
                    default: "",
                    trim: true
                },

                description: {
                    type: String,
                    default: "",
                    trim: true
                }
            }
        ],


        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        isActive: {
            type: Boolean,
            default: true
        },


        // =====================================================
        // VERIFICATION
        // =====================================================

        isVerified: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);