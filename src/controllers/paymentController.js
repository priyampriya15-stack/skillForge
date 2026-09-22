const Payment = require("../models/Payment");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

// =====================================================
// RAZORPAY INSTANCE
// =====================================================

const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        return null;
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

// =====================================================
// CREATE RAZORPAY ORDER
// POST /api/payments/create-order
// =====================================================

const createRazorpayOrder = async (req, res, next) => {
    try {
        // -------------------------------------------------
        // DEBUG REQUEST
        // -------------------------------------------------

        console.log("======================================");
        console.log("CREATE RAZORPAY ORDER");
        console.log("======================================");

        console.log("USER:", req.user?._id);
        console.log("REQUEST BODY:", req.body);

        // -------------------------------------------------
        // RAZORPAY CONFIGURATION
        // -------------------------------------------------

        const razorpay = getRazorpayInstance();

        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message:
                    "Razorpay is not configured. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
            });
        }

        // -------------------------------------------------
        // GET PROJECT ID
        // -------------------------------------------------
        //
        // Frontend sends:
        //
        // {
        //   amount: 9000,
        //   projectId: "PROJECT_ID"
        // }
        //
        // We support both:
        //
        // projectId
        // project
        //
        // -------------------------------------------------

        const projectId =
            req.body?.projectId ||
            req.body?.project ||
            req.body?.project_id;

        console.log("PROJECT ID RECEIVED:", projectId);

        if (!projectId) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        // -------------------------------------------------
        // VALIDATE PROJECT ID
        // -------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // -------------------------------------------------
        // FIND PROJECT
        // -------------------------------------------------

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        console.log("PROJECT FOUND:", {
            id: project._id,
            title: project.title,
            client: project.client,
        });

        // -------------------------------------------------
        // CLIENT OWNERSHIP CHECK
        // -------------------------------------------------

        if (
            !project.client ||
            project.client.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to make payment for this project",
            });
        }

        // -------------------------------------------------
        // FIND ACCEPTED APPLICATION
        // -------------------------------------------------

        const application = await Application.findOne({
            project: projectId,
            status: "accepted",
        }).populate("freelancer", "name email");

        if (!application) {
            return res.status(400).json({
                success: false,
                message:
                    "No accepted freelancer found for this project",
            });
        }

        // -------------------------------------------------
        // VALIDATE FREELANCER
        // -------------------------------------------------

        if (!application.freelancer) {
            return res.status(400).json({
                success: false,
                message: "Accepted freelancer not found",
            });
        }

        const freelancerId = application.freelancer._id;

        // -------------------------------------------------
        // VALIDATE BID AMOUNT
        // -------------------------------------------------

        const amount = Number(application.bidAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid accepted bid amount",
            });
        }

        // -------------------------------------------------
        // CONVERT INR TO PAISE
        // -------------------------------------------------

        const amountInPaise = Math.round(amount * 100);

        if (amountInPaise < 100) {
            return res.status(400).json({
                success: false,
                message: "Payment amount must be at least ₹1",
            });
        }

        console.log("PAYMENT AMOUNT:", {
            rupees: amount,
            paise: amountInPaise,
        });

        // -------------------------------------------------
        // CHECK EXISTING PAYMENT
        // -------------------------------------------------

        const existingPayment = await Payment.findOne({
            project: projectId,
            client: req.user._id,
            freelancer: freelancerId,
            status: {
                $in: ["pending", "paid"],
            },
        });

        if (existingPayment) {
            // ---------------------------------------------
            // ALREADY PAID
            // ---------------------------------------------

            if (existingPayment.status === "paid") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Payment has already been completed for this project",
                    payment: existingPayment,
                });
            }

            // ---------------------------------------------
            // PENDING PAYMENT
            // ---------------------------------------------

            console.log(
                "PENDING PAYMENT ALREADY EXISTS:",
                existingPayment._id
            );

            return res.status(200).json({
                success: true,

                message:
                    "A pending payment already exists",

                existingPayment: true,

                order: {
                    id: existingPayment.razorpayOrderId,
                    amount: Math.round(
                        existingPayment.amount * 100
                    ),
                    currency: "INR",
                },

                payment: {
                    id: existingPayment._id,
                    amount: existingPayment.amount,
                    status: existingPayment.status,
                    razorpayOrderId:
                        existingPayment.razorpayOrderId,
                },

                project: {
                    id: project._id,
                    title: project.title,
                },

                freelancer: {
                    id: freelancerId,
                    name: application.freelancer.name,
                    email: application.freelancer.email,
                },

                keyId: process.env.RAZORPAY_KEY_ID,
            });
        }

        // -------------------------------------------------
        // CREATE RAZORPAY ORDER
        // -------------------------------------------------

        const orderOptions = {
            amount: amountInPaise,
            currency: "INR",

            receipt: `project_${projectId}_${Date.now()}`,

            notes: {
                projectId: projectId.toString(),
                clientId: req.user._id.toString(),
                freelancerId: freelancerId.toString(),
                applicationId:
                    application._id.toString(),
            },
        };

        console.log(
            "RAZORPAY ORDER OPTIONS:",
            orderOptions
        );

        const order =
            await razorpay.orders.create(
                orderOptions
            );

        console.log(
            "RAZORPAY ORDER CREATED:",
            order.id
        );

        // -------------------------------------------------
        // CREATE DATABASE PAYMENT
        // -------------------------------------------------

        const payment = await Payment.create({
            project: projectId,
            client: req.user._id,
            freelancer: freelancerId,
            amount,
            paymentMethod: "upi",
            status: "pending",
            razorpayOrderId: order.id,
        });

        console.log(
            "DATABASE PAYMENT CREATED:",
            payment._id
        );

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(201).json({
            success: true,

            message:
                "Razorpay order created successfully",

            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },

            payment: {
                id: payment._id,
                amount: payment.amount,
                status: payment.status,
                razorpayOrderId:
                    payment.razorpayOrderId,
            },

            project: {
                id: project._id,
                title: project.title,
            },

            freelancer: {
                id: freelancerId,
                name: application.freelancer.name,
                email: application.freelancer.email,
            },

            keyId:
                process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error(
            "CREATE RAZORPAY ORDER ERROR:",
            error
        );

        next(error);
    }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payments/verify
// =====================================================

const verifyRazorpayPayment = async (
    req,
    res,
    next
) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        console.log("======================================");
        console.log("VERIFY RAZORPAY PAYMENT");
        console.log("======================================");

        console.log("ORDER ID:", razorpay_order_id);
        console.log("PAYMENT ID:", razorpay_payment_id);

        // -------------------------------------------------
        // VALIDATE REQUEST
        // -------------------------------------------------

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Razorpay payment details are required",
            });
        }

        // -------------------------------------------------
        // SECRET CHECK
        // -------------------------------------------------

        const secret =
            process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message:
                    "Razorpay secret key is not configured",
            });
        }

        // -------------------------------------------------
        // GENERATE SIGNATURE
        // -------------------------------------------------

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    secret
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        // -------------------------------------------------
        // SAFE SIGNATURE COMPARISON
        // -------------------------------------------------

        const generatedBuffer =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "utf8"
            );

        if (
            generatedBuffer.length !==
            receivedBuffer.length
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment signature",
            });
        }

        const isValidSignature =
            crypto.timingSafeEqual(
                generatedBuffer,
                receivedBuffer
            );

        if (!isValidSignature) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment signature",
            });
        }

        // -------------------------------------------------
        // FIND PAYMENT
        // -------------------------------------------------

        const payment =
            await Payment.findOne({
                razorpayOrderId:
                    razorpay_order_id,
            });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment record not found",
            });
        }

        // -------------------------------------------------
        // CLIENT AUTHORIZATION
        // -------------------------------------------------

        if (
            payment.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to verify this payment",
            });
        }

        // -------------------------------------------------
        // DUPLICATE VERIFICATION
        // -------------------------------------------------

        if (payment.status === "paid") {
            return res.status(200).json({
                success: true,
                message:
                    "Payment was already verified",
                payment,
            });
        }

        // -------------------------------------------------
        // UPDATE PAYMENT
        // -------------------------------------------------

        payment.status = "paid";

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.transactionId =
            razorpay_payment_id;

        payment.paidAt = new Date();

        await payment.save();

        // -------------------------------------------------
        // NOTIFY FREELANCER
        // -------------------------------------------------

        try {
            await Notification.create({
                recipient:
                    payment.freelancer,

                type: "payment",

                title: "Payment Received",

                message:
                    `Payment of ₹${payment.amount} has been completed.`,
            });
        } catch (notificationError) {
            console.error(
                "PAYMENT NOTIFICATION ERROR:",
                notificationError.message
            );
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({
            success: true,

            message:
                "Payment verified successfully",

            payment,
        });
    } catch (error) {
        console.error(
            "VERIFY PAYMENT ERROR:",
            error
        );

        next(error);
    }
};

// =====================================================
// GET MY PAYMENTS
// GET /api/payments/my
// GET /api/payments/client
// GET /api/payments/freelancer
// =====================================================

const getMyPayments = async (
    req,
    res,
    next
) => {
    try {
        const userId = req.user._id;

        console.log("======================================");
        console.log("GET MY PAYMENTS");
        console.log("USER ID:", userId);
        console.log("======================================");

        const payments =
            await Payment.find({
                $or: [
                    {
                        client: userId,
                    },
                    {
                        freelancer: userId,
                    },
                ],
            })
                .populate(
                    "project",
                    "title budget status deadline"
                )
                .populate(
                    "client",
                    "name email profileImage"
                )
                .populate(
                    "freelancer",
                    "name email profileImage"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,

            count: payments.length,

            payments,
        });
    } catch (error) {
        console.error(
            "GET MY PAYMENTS ERROR:",
            error
        );

        next(error);
    }
};

// =====================================================
// GET PAYMENT BY ID
// GET /api/payments/:id
// =====================================================

const getPaymentById = async (
    req,
    res,
    next
) => {
    try {
        const paymentId =
            req.params.id;

        // -------------------------------------------------
        // VALIDATE ID
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                paymentId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment ID",
            });
        }

        // -------------------------------------------------
        // FIND PAYMENT
        // -------------------------------------------------

        const payment =
            await Payment.findById(
                paymentId
            )
                .populate(
                    "project",
                    "title budget status deadline"
                )
                .populate(
                    "client",
                    "name email profileImage"
                )
                .populate(
                    "freelancer",
                    "name email profileImage"
                );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment not found",
            });
        }

        // -------------------------------------------------
        // AUTHORIZATION
        // -------------------------------------------------

        const currentUser =
            req.user._id.toString();

        const clientId =
            payment.client?._id?.toString();

        const freelancerId =
            payment.freelancer?._id?.toString();

        if (
            currentUser !== clientId &&
            currentUser !== freelancerId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to view this payment",
            });
        }

        return res.status(200).json({
            success: true,
            payment,
        });
    } catch (error) {
        console.error(
            "GET PAYMENT BY ID ERROR:",
            error
        );

        next(error);
    }
};

// =====================================================
// UPDATE PAYMENT STATUS
// PUT /api/payments/:id/status
// =====================================================

const updatePaymentStatus = async (
    req,
    res,
    next
) => {
    try {
        const paymentId =
            req.params.id;

        // -------------------------------------------------
        // VALIDATE ID
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                paymentId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment ID",
            });
        }

        const {
            status,
            transactionId,
        } = req.body;

        // -------------------------------------------------
        // ALLOWED STATUSES
        // -------------------------------------------------

        const allowedStatuses = [
            "pending",
            "failed",
            "refunded",
        ];

        if (
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment status. Paid status is handled by Razorpay verification.",
            });
        }

        // -------------------------------------------------
        // FIND PAYMENT
        // -------------------------------------------------

        const payment =
            await Payment.findById(
                paymentId
            );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment not found",
            });
        }

        // -------------------------------------------------
        // CLIENT AUTHORIZATION
        // -------------------------------------------------

        if (
            payment.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the client can update payment status",
            });
        }

        // -------------------------------------------------
        // PROTECT PAID PAYMENT
        // -------------------------------------------------

        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message:
                    "Paid payments cannot be manually changed",
            });
        }

        // -------------------------------------------------
        // UPDATE
        // -------------------------------------------------

        payment.status = status;

        if (transactionId) {
            payment.transactionId =
                transactionId;
        }

        await payment.save();

        // -------------------------------------------------
        // NOTIFY FREELANCER
        // -------------------------------------------------

        try {
            await Notification.create({
                recipient:
                    payment.freelancer,

                type: "payment",

                title:
                    "Payment Status Updated",

                message:
                    `Payment status updated to ${status}.`,
            });
        } catch (notificationError) {
            console.error(
                "PAYMENT STATUS NOTIFICATION ERROR:",
                notificationError.message
            );
        }

        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(200).json({
            success: true,

            message:
                "Payment status updated successfully",

            payment,
        });
    } catch (error) {
        console.error(
            "UPDATE PAYMENT STATUS ERROR:",
            error
        );

        next(error);
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    getMyPayments,
    getPaymentById,
    updatePaymentStatus,
};