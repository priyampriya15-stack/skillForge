const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // ========================================
        // PROJECT
        // ========================================

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        // ========================================
        // CLIENT
        // ========================================

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ========================================
        // FREELANCER
        // ========================================

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ========================================
        // PAYMENT AMOUNT
        // ========================================

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // ========================================
        // PAYMENT METHOD
        // ========================================

        paymentMethod: {
            type: String,
            enum: [
                "upi",
                "card",
                "bank_transfer",
                "cash"
            ],
            default: "upi"
        },

        // ========================================
        // PAYMENT STATUS
        // ========================================

        status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        // ========================================
        // TRANSACTION ID
        // ========================================

        transactionId: {
            type: String,
            default: null
        },

        // ========================================
        // RAZORPAY ORDER ID
        // ========================================

        razorpayOrderId: {
            type: String,
            default: null
        },

        // ========================================
        // RAZORPAY PAYMENT ID
        // ========================================

        razorpayPaymentId: {
            type: String,
            default: null
        },

        // ========================================
        // PAYMENT DATE
        // ========================================

        paidAt: {
            type: Date,
            default: null
        }
    },

    // ========================================
    // TIMESTAMPS
    // ========================================

    {
        timestamps: true
    }
);


// ========================================
// EXPORT MODEL
// ========================================

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);