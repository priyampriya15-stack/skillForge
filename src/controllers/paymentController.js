const Payment = require("../models/Payment");
const Project = require("../models/Project");
const Notification = require("../models/Notification");

const Razorpay = require("razorpay");
const crypto = require("crypto");


// ========================================
// RAZORPAY CONFIG CHECK
// ========================================

console.log("=================================");
console.log("RAZORPAY CONFIG CHECK");
console.log("=================================");

console.log(
    "RAZORPAY_KEY_ID Loaded:",
    !!process.env.RAZORPAY_KEY_ID
);

console.log(
    "RAZORPAY_KEY_SECRET Loaded:",
    !!process.env.RAZORPAY_KEY_SECRET
);


// ========================================
// SHOW ONLY PARTIAL KEY ID
// SECRET WILL NOT BE SHOWN
// ========================================

if (process.env.RAZORPAY_KEY_ID) {

    const key = process.env.RAZORPAY_KEY_ID;

    console.log(
        "Razorpay Key ID:",
        key.substring(0, 8) + "********"
    );

} else {

    console.log(
        "Razorpay Key ID: NOT FOUND"
    );
}


// ========================================
// SECRET LENGTH CHECK
// ========================================

if (process.env.RAZORPAY_KEY_SECRET) {

    console.log(
        "Razorpay Secret Length:",
        process.env.RAZORPAY_KEY_SECRET.length
    );

} else {

    console.log(
        "Razorpay Secret Length: 0"
    );
}


console.log("=================================");


// ========================================
// RAZORPAY INSTANCE
// ========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ========================================
// CREATE RAZORPAY ORDER
// ========================================

const createRazorpayOrder = async (req, res, next) => {

    try {

        const {
            project,
            freelancer,
            amount
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (!project || !freelancer || !amount) {

            return res.status(400).json({
                success: false,
                message:
                    "Project, freelancer and amount are required"
            });
        }


        // ========================================
        // CHECK AMOUNT
        // ========================================

        if (Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Amount must be greater than 0"
            });
        }


        // ========================================
        // FIND PROJECT
        // ========================================

        const projectData =
            await Project.findById(project);


        if (!projectData) {

            return res.status(404).json({
                success: false,
                message:
                    "Project not found"
            });
        }


        // ========================================
        // CHECK PROJECT CLIENT
        // ========================================

        if (
            projectData.client.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Only project client can make payment"
            });
        }


        // ========================================
        // RAZORPAY OPTIONS
        // ========================================

        const options = {

            amount:
                Math.round(Number(amount) * 100),

            currency: "INR",

            receipt:
                `project_${project}_${Date.now()}`
        };


        // ========================================
        // DEBUG LOG
        // ========================================

        console.log("=================================");
        console.log("CREATING RAZORPAY ORDER");
        console.log("=================================");

        console.log(
            "Amount:",
            options.amount
        );

        console.log(
            "Currency:",
            options.currency
        );

        console.log(
            "Project:",
            project
        );

        console.log(
            "Freelancer:",
            freelancer
        );

        console.log(
            "Client:",
            req.user._id
        );

        console.log("=================================");


        // ========================================
        // CREATE RAZORPAY ORDER
        // ========================================

        const order =
            await razorpay.orders.create(options);


        // ========================================
        // ORDER CREATED
        // ========================================

        console.log(
            "Razorpay Order Created:",
            order.id
        );


        // ========================================
        // CREATE PAYMENT RECORD
        // ========================================

        const payment =
            await Payment.create({

                project: project,

                client: req.user._id,

                freelancer: freelancer,

                amount: Number(amount),

                paymentMethod: "upi",

                status: "pending",

                razorpayOrderId: order.id
            });


        // ========================================
        // SUCCESS RESPONSE
        // ========================================

        res.status(201).json({

            success: true,

            message:
                "Razorpay order created successfully",

            order: {

                id: order.id,

                amount: order.amount,

                currency: order.currency
            },

            payment: {

                id: payment._id,

                amount: payment.amount,

                status: payment.status,

                razorpayOrderId:
                    payment.razorpayOrderId
            }
        });


    } catch (error) {

        // ========================================
        // RAZORPAY ERROR
        // ========================================

        console.error(
            "===================================="
        );

        console.error(
            "RAZORPAY CREATE ORDER ERROR"
        );

        console.error(
            "===================================="
        );

        console.error(
            "Error Object:",
            error
        );

        console.error(
            "Error Message:",
            error?.message
        );

        console.error(
            "Error Description:",
            error?.description
        );

        console.error(
            "Error Status Code:",
            error?.statusCode
        );

        console.error(
            "Error Response:",
            error?.response
        );

        console.error(
            "Error Stack:",
            error?.stack
        );

        console.error(
            "===================================="
        );


        next(error);
    }
};


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================

const verifyRazorpayPayment = async (
    req,
    res,
    next
) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification details are required"
            });
        }


        // ========================================
        // GENERATE SIGNATURE
        // ========================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");


        // ========================================
        // CHECK SIGNATURE
        // ========================================

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment verification failed"
            });
        }


        // ========================================
        // FIND PAYMENT
        // ========================================

        const payment =
            await Payment.findOne({

                razorpayOrderId:
                    razorpay_order_id
            });


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment record not found"
            });
        }


        // ========================================
        // CHECK CLIENT
        // ========================================

        if (
            payment.client.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have permission"
            });
        }


        // ========================================
        // UPDATE PAYMENT
        // ========================================

        payment.status = "paid";

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.transactionId =
            razorpay_payment_id;

        payment.paidAt =
            new Date();


        await payment.save();


        // ========================================
        // NOTIFICATION
        // ========================================

        await Notification.create({

            user:
                payment.freelancer,

            message:
                `Payment of ₹${payment.amount} has been completed successfully.`,

            type:
                "payment"
        });


        // ========================================
        // SUCCESS
        // ========================================

        res.status(200).json({

            success: true,

            message:
                "Payment verified successfully",

            payment: {

                id:
                    payment._id,

                amount:
                    payment.amount,

                status:
                    payment.status,

                transactionId:
                    payment.transactionId,

                razorpayOrderId:
                    payment.razorpayOrderId,

                razorpayPaymentId:
                    payment.razorpayPaymentId,

                paidAt:
                    payment.paidAt
            }
        });


    } catch (error) {

        console.error(
            "Payment Verification Error:",
            error.message
        );

        console.error(error);

        next(error);
    }
};


// ========================================
// GET MY PAYMENTS
// ========================================

const getMyPayments = async (
    req,
    res,
    next
) => {

    try {

        const payments =
            await Payment.find({

                $or: [

                    {
                        client:
                            req.user._id
                    },

                    {
                        freelancer:
                            req.user._id
                    }
                ]

            })

                .populate(
                    "project",
                    "title budget status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                )

                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            success: true,

            count:
                payments.length,

            payments
        });


    } catch (error) {

        next(error);
    }
};


// ========================================
// GET SINGLE PAYMENT
// ========================================

const getPaymentById = async (
    req,
    res,
    next
) => {

    try {

        const payment =
            await Payment.findById(
                req.params.id
            )

                .populate(
                    "project",
                    "title budget status"
                )

                .populate(
                    "client",
                    "name email"
                )

                .populate(
                    "freelancer",
                    "name email"
                );


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found"
            });
        }


        // ========================================
        // CHECK ACCESS
        // ========================================

        if (

            payment.client._id.toString() !==
                req.user._id.toString()

            &&

            payment.freelancer._id.toString() !==
                req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have permission"
            });
        }


        res.status(200).json({

            success: true,

            payment
        });


    } catch (error) {

        next(error);
    }
};


// ========================================
// UPDATE PAYMENT STATUS
// ========================================

const updatePaymentStatus = async (
    req,
    res,
    next
) => {

    try {

        const { status } =
            req.body;


        // ========================================
        // VALID STATUS
        // ========================================

        if (
            ![
                "pending",
                "paid",
                "failed",
                "refunded"
            ].includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment status"
            });
        }


        // ========================================
        // FIND PAYMENT
        // ========================================

        const payment =
            await Payment.findById(
                req.params.id
            )

                .populate(
                    "project"
                )

                .populate(
                    "freelancer",
                    "name email"
                );


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found"
            });
        }


        // ========================================
        // CHECK CLIENT
        // ========================================

        if (
            payment.client.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Only client can update payment status"
            });
        }


        // ========================================
        // UPDATE STATUS
        // ========================================

        payment.status =
            status;


        if (
            status === "paid"
        ) {

            payment.paidAt =
                new Date();


            if (
                !payment.transactionId
            ) {

                payment.transactionId =
                    payment.razorpayPaymentId ||
                    `TXN${Date.now()}`;
            }
        }


        await payment.save();


        // ========================================
        // NOTIFICATION
        // ========================================

        await Notification.create({

            user:
                payment.freelancer._id,

            message:
                `Payment status for "${payment.project.title}" is now ${status}.`,

            type:
                "payment"
        });


        // ========================================
        // SUCCESS
        // ========================================

        res.status(200).json({

            success: true,

            message:
                `Payment ${status} successfully`,

            payment
        });


    } catch (error) {

        console.error(
            "Update Payment Status Error:",
            error.message
        );

        next(error);
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createRazorpayOrder,

    verifyRazorpayPayment,

    getMyPayments,

    getPaymentById,

    updatePaymentStatus
};