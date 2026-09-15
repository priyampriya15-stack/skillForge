const express = require("express");

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus
} = require("../controllers/paymentController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE RAZORPAY ORDER
// ========================================

router.post(
    "/create-order",
    protect,
    createRazorpayOrder
);


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================

router.post(
    "/verify",
    protect,
    verifyRazorpayPayment
);


// ========================================
// GET MY PAYMENTS
// ========================================

router.get(
    "/my",
    protect,
    getMyPayments
);


// ========================================
// GET SINGLE PAYMENT
// ========================================

router.get(
    "/:id",
    protect,
    getPaymentById
);


// ========================================
// UPDATE PAYMENT STATUS
// ========================================

router.put(
    "/:id/status",
    protect,
    updatePaymentStatus
);


module.exports = router;