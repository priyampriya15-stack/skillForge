const sendEmail = require("../utils/sendEmail");

const testEmail = async (req, res) => {
    try {
        const { to } = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                message: "Recipient email is required"
            });
        }

        const result = await sendEmail(
            to,
            "Freelance Marketplace Test Email",
            "Nodemailer is working successfully in our Freelance Project Marketplace."
        );

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Email sending failed"
            });
        }

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    testEmail
};