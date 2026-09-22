const express = require("express");

const router = express.Router();


// =====================================================
// PAYMENT CONTROLLER
// =====================================================

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus
} = require("../controllers/paymentController");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
    protect
} = require("../middleware/authMiddleware");


// =====================================================
// GET MY PAYMENTS
// =====================================================
// GET /api/payments/my
// =====================================================

router.get(
    "/my",
    protect,
    getMyPayments
);


// =====================================================
// GET CLIENT PAYMENTS
// =====================================================
// GET /api/payments/client
// =====================================================

router.get(
    "/client",
    protect,
    getMyPayments
);


// =====================================================
// GET FREELANCER PAYMENTS
// =====================================================
// GET /api/payments/freelancer
// =====================================================

router.get(
    "/freelancer",
    protect,
    getMyPayments
);


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================
// POST /api/payments/create-order
//
// Body:
//
// {
//     "project": "PROJECT_ID"
// }
//
// =====================================================

router.post(
    "/create-order",
    protect,
    createRazorpayOrder
);


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================
// POST /api/payments/verify
// =====================================================

router.post(
    "/verify",
    protect,
    verifyRazorpayPayment
);


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================
// PUT /api/payments/:id/status
// =====================================================

router.put(
    "/:id/status",
    protect,
    updatePaymentStatus
);


// =====================================================
// GET PAYMENT BY ID
// =====================================================
// GET /api/payments/:id
// =====================================================

router.get(
    "/:id",
    protect,
    getPaymentById
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;