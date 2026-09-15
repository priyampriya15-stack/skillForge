const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");


const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            phone
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "freelancer",
            phone: phone || ""
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            token
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            token
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getMe = async (req, res) => {

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


module.exports = {
    register,
    login,
    getMe
};