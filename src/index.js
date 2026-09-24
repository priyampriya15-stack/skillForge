// =====================================================
// SKILLFORGE BACKEND - INDEX.JS
// =====================================================

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

const dotenv = require("dotenv");

dotenv.config();


// =====================================================
// IMPORT PACKAGES
// =====================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


// =====================================================
// DATABASE
// =====================================================

const connectDB = require("./config/db");


// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const projectRoutes = require("./routes/projectRoutes");

const proposalRoutes = require("./routes/proposalRoutes");

const milestoneRoutes = require("./routes/milestoneRoutes");

const reviewRoutes = require("./routes/reviewRoutes");

const adminRoutes = require("./routes/adminRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");

const applicationRoutes =
    require("./routes/applicationRoutes");

const emailRoutes =
    require("./routes/emailRoutes");

const fileRoutes =
    require("./routes/fileRoutes");

const paymentRoutes =
    require("./routes/paymentRoutes");

const messageRoutes =
    require("./routes/messageRoutes");


// =====================================================
// AI RECOMMENDATION ROUTES
// =====================================================

const recommendationRoutes =
    require("./routes/recommendationRoutes");


// =====================================================
// FREELANCER PORTFOLIO ROUTES
// =====================================================

const portfolioRoutes =
    require("./routes/portfolioRoutes");


// =====================================================
// PROFILE ROUTES
// =====================================================

const profileRoutes =
    require("./routes/profileRoutes");


// =====================================================
// SKILL ROUTES
// =====================================================

const skillRoutes =
    require("./routes/skillRoutes");


// =====================================================
// COURSE ROUTES
// =====================================================

const courseRoutes =
    require("./routes/courseRoutes");


// =====================================================
// ERROR MIDDLEWARE
// =====================================================

const errorMiddleware =
    require("./middleware/errorMiddleware");

const errorHandler =
    typeof errorMiddleware === "function"
        ? errorMiddleware
        : errorMiddleware?.errorHandler;


// =====================================================
// CONNECT DATABASE
// =====================================================

connectDB();


// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// CREATE HTTP SERVER
// =====================================================

const server = http.createServer(app);


// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: "*",

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);


app.use(express.json());


app.use(
    express.urlencoded({
        extended: true,
    })
);


// =====================================================
// UPLOADS
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// =====================================================
// ROOT / TEST API
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "SkillForge Freelance Platform API Running...",

        });

    }
);


// =====================================================
// ROUTE VALIDATION
// =====================================================

console.log("");

console.log(
    "======================================"
);

console.log(
    "SKILLFORGE ROUTE VALIDATION"
);

console.log(
    "======================================"
);


console.log(
    "authRoutes:",
    typeof authRoutes
);

console.log(
    "userRoutes:",
    typeof userRoutes
);

console.log(
    "projectRoutes:",
    typeof projectRoutes
);

console.log(
    "proposalRoutes:",
    typeof proposalRoutes
);

console.log(
    "milestoneRoutes:",
    typeof milestoneRoutes
);

console.log(
    "reviewRoutes:",
    typeof reviewRoutes
);

console.log(
    "adminRoutes:",
    typeof adminRoutes
);

console.log(
    "notificationRoutes:",
    typeof notificationRoutes
);

console.log(
    "applicationRoutes:",
    typeof applicationRoutes
);

console.log(
    "emailRoutes:",
    typeof emailRoutes
);

console.log(
    "fileRoutes:",
    typeof fileRoutes
);

console.log(
    "paymentRoutes:",
    typeof paymentRoutes
);

console.log(
    "messageRoutes:",
    typeof messageRoutes
);

console.log(
    "recommendationRoutes:",
    typeof recommendationRoutes
);

console.log(
    "portfolioRoutes:",
    typeof portfolioRoutes
);

console.log(
    "profileRoutes:",
    typeof profileRoutes
);

console.log(
    "skillRoutes:",
    typeof skillRoutes
);

console.log(
    "courseRoutes:",
    typeof courseRoutes
);

console.log(
    "errorHandler:",
    typeof errorHandler
);


console.log(
    "======================================"
);

console.log("");


// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// USER ROUTES
// =====================================================

app.use(
    "/api/users",
    userRoutes
);


// =====================================================
// PROJECT ROUTES
// =====================================================

app.use(
    "/api/projects",
    projectRoutes
);


// =====================================================
// APPLICATION ROUTES
// =====================================================

app.use(
    "/api/applications",
    applicationRoutes
);


// =====================================================
// PROPOSAL ROUTES
// =====================================================

app.use(
    "/api/proposals",
    proposalRoutes
);


// =====================================================
// MILESTONE ROUTES
// =====================================================

app.use(
    "/api/milestones",
    milestoneRoutes
);


// =====================================================
// REVIEW ROUTES
// =====================================================

app.use(
    "/api/reviews",
    reviewRoutes
);


// =====================================================
// ADMIN ROUTES
// =====================================================

app.use(
    "/api/admin",
    adminRoutes
);


// =====================================================
// NOTIFICATION ROUTES
// =====================================================

app.use(
    "/api/notifications",
    notificationRoutes
);


// =====================================================
// MESSAGE ROUTES
// =====================================================

/*
POST /api/messages/send
GET  /api/messages/conversation/:userId
PUT  /api/messages/read/:id
*/

app.use(
    "/api/messages",
    messageRoutes
);


// =====================================================
// EMAIL ROUTES
// =====================================================

app.use(
    "/api/email",
    emailRoutes
);


// =====================================================
// FILE ROUTES
// =====================================================

app.use(
    "/api/files",
    fileRoutes
);


// =====================================================
// PAYMENT ROUTES
// =====================================================

app.use(
    "/api/payments",
    paymentRoutes
);


// =====================================================
// AI RECOMMENDATION ROUTES
// =====================================================

app.use(
    "/api/recommendations",
    recommendationRoutes
);


// =====================================================
// FREELANCER PORTFOLIO ROUTES
// =====================================================

app.use(
    "/api/freelancer/portfolio",
    portfolioRoutes
);


// =====================================================
// PROFILE ROUTES
// =====================================================

app.use(
    "/api/profile",
    profileRoutes
);


// =====================================================
// SKILL ROUTES
// =====================================================

/*
GET    /api/skills
GET    /api/skills/:id
POST   /api/skills
PUT    /api/skills/:id
DELETE /api/skills/:id
*/

app.use(
    "/api/skills",
    skillRoutes
);


// =====================================================
// COURSE ROUTES
// =====================================================

/*
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
*/

app.use(
    "/api/courses",
    courseRoutes
);


// =====================================================
// PAYMENT API INFORMATION
// =====================================================

app.get(
    "/api/payment-info",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Payment API is running",

            endpoints: {

                myPayments:
                    "GET /api/payments/my",

                clientPayments:
                    "GET /api/payments/client",

                freelancerPayments:
                    "GET /api/payments/freelancer",

                createOrder:
                    "POST /api/payments/create-order",

                verifyPayment:
                    "POST /api/payments/verify",

                updateStatus:
                    "PUT /api/payments/:id/status",

                paymentById:
                    "GET /api/payments/:id",

            },

        });

    }
);


// =====================================================
// SKILLS API INFORMATION
// =====================================================

app.get(
    "/api/skills-info",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Skill API is running",

            endpoints: {

                allSkills:
                    "GET /api/skills",

                skillById:
                    "GET /api/skills/:id",

                createSkill:
                    "POST /api/skills",

                updateSkill:
                    "PUT /api/skills/:id",

                deleteSkill:
                    "DELETE /api/skills/:id",

            },

        });

    }
);


// =====================================================
// COURSES API INFORMATION
// =====================================================

app.get(
    "/api/courses-info",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Course API is running",

            endpoints: {

                allCourses:
                    "GET /api/courses",

                courseById:
                    "GET /api/courses/:id",

                createCourse:
                    "POST /api/courses",

                updateCourse:
                    "PUT /api/courses/:id",

                deleteCourse:
                    "DELETE /api/courses/:id",

            },

        });

    }
);


// =====================================================
// SOCKET.IO
// REAL-TIME CHAT
// =====================================================

io.on(
    "connection",
    (socket) => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "SOCKET USER CONNECTED"
        );

        console.log(
            "Socket ID:",
            socket.id
        );

        console.log(
            "======================================"
        );


        // =================================================
        // JOIN CHAT ROOM
        // =================================================

        socket.on(
            "joinRoom",
            (roomId) => {

                try {

                    if (!roomId) {

                        console.log(
                            "Socket joinRoom: Room ID missing"
                        );

                        return;

                    }


                    socket.join(roomId);


                    console.log(
                        `Socket ${socket.id} joined room: ${roomId}`
                    );

                } catch (error) {

                    console.error(
                        "Socket joinRoom error:",
                        error
                    );

                }

            }
        );


        // =================================================
        // SEND REAL-TIME MESSAGE
        // =================================================

        socket.on(
            "sendMessage",
            (data) => {

                try {

                    if (!data) {

                        console.log(
                            "Socket message data missing"
                        );

                        return;

                    }


                    if (!data.roomId) {

                        console.log(
                            "Socket roomId missing"
                        );

                        return;

                    }


                    if (!data.message) {

                        console.log(
                            "Socket message missing"
                        );

                        return;

                    }


                    console.log("");

                    console.log(
                        "--------------------------------------"
                    );

                    console.log(
                        "REAL-TIME MESSAGE"
                    );

                    console.log(
                        "Room:",
                        data.roomId
                    );

                    console.log(
                        "Sender:",
                        data.sender
                    );

                    console.log(
                        "Receiver:",
                        data.receiver
                    );

                    console.log(
                        "Message:",
                        data.message
                    );

                    console.log(
                        "--------------------------------------"
                    );


                    socket
                        .to(data.roomId)
                        .emit(
                            "receiveMessage",
                            {

                                _id:
                                    data._id || null,

                                sender:
                                    data.sender,

                                receiver:
                                    data.receiver,

                                message:
                                    data.message,

                                roomId:
                                    data.roomId,

                                createdAt:
                                    data.createdAt ||
                                    new Date(),

                                isRead:
                                    false,

                            }
                        );


                } catch (error) {

                    console.error(
                        "Socket sendMessage error:",
                        error
                    );

                }

            }
        );


        // =================================================
        // DISCONNECT
        // =================================================

        socket.on(
            "disconnect",
            (reason) => {

                console.log("");

                console.log(
                    "SOCKET USER DISCONNECTED"
                );

                console.log(
                    "Socket ID:",
                    socket.id
                );

                console.log(
                    "Reason:",
                    reason
                );

                console.log("");

            }
        );

    }
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`,

        });

    }
);


// =====================================================
// ERROR HANDLER
// =====================================================

if (
    typeof errorHandler === "function"
) {

    app.use(
        errorHandler
    );

} else {

    console.error(
        "WARNING: errorHandler is not a function."
    );


    app.use(
        (err, req, res, next) => {

            console.error(
                "SERVER ERROR:",
                err
            );


            res.status(
                err.status || 500
            ).json({

                success: false,

                message:
                    err.message ||
                    "Internal Server Error",

            });

        }
    );

}


// =====================================================
// SERVER PORT
// =====================================================

const PORT =
    process.env.PORT || 5000;


// =====================================================
// START SERVER
// =====================================================

server.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "SKILLFORGE SERVER STARTED"
        );

        console.log(
            "======================================"
        );


        console.log(
            `Server running on port ${PORT}`
        );


        console.log(
            `API Base URL: http://localhost:${PORT}/api`
        );


        // =================================================
        // AUTH
        // =================================================

        console.log(
            `Auth API: http://localhost:${PORT}/api/auth`
        );


        // =================================================
        // USERS
        // =================================================

        console.log(
            `Users API: http://localhost:${PORT}/api/users`
        );


        // =================================================
        // PROJECTS
        // =================================================

        console.log(
            `Projects API: http://localhost:${PORT}/api/projects`
        );

        console.log(
            `My Projects API: http://localhost:${PORT}/api/projects/my-projects`
        );


        // =================================================
        // APPLICATIONS
        // =================================================

        console.log(
            `Applications API: http://localhost:${PORT}/api/applications`
        );


        // =================================================
        // PROPOSALS
        // =================================================

        console.log(
            `Proposals API: http://localhost:${PORT}/api/proposals`
        );


        // =================================================
        // MILESTONES
        // =================================================

        console.log(
            `Milestones API: http://localhost:${PORT}/api/milestones`
        );


        // =================================================
        // REVIEWS
        // =================================================

        console.log(
            `Reviews API: http://localhost:${PORT}/api/reviews`
        );


        // =================================================
        // PAYMENTS
        // =================================================

        console.log(
            `Payments API: http://localhost:${PORT}/api/payments`
        );

        console.log(
            `Payment Info API: http://localhost:${PORT}/api/payment-info`
        );

        console.log(
            `Create Razorpay Order: http://localhost:${PORT}/api/payments/create-order`
        );

        console.log(
            `Verify Razorpay Payment: http://localhost:${PORT}/api/payments/verify`
        );

        console.log(
            `My Payments: http://localhost:${PORT}/api/payments/my`
        );

        console.log(
            `Client Payments: http://localhost:${PORT}/api/payments/client`
        );

        console.log(
            `Freelancer Payments: http://localhost:${PORT}/api/payments/freelancer`
        );


        // =================================================
        // AI RECOMMENDATIONS
        // =================================================

        console.log(
            `AI Recommendation API: http://localhost:${PORT}/api/recommendations`
        );

        console.log(
            `Client AI Recommendation API: http://localhost:${PORT}/api/recommendations/projects/:projectId/freelancers`
        );

        console.log(
            `Freelancer AI Recommendation API: http://localhost:${PORT}/api/recommendations/freelancer/projects`
        );


        // =================================================
        // PORTFOLIO
        // =================================================

        console.log(
            `Portfolio API: http://localhost:${PORT}/api/freelancer/portfolio`
        );


        // =================================================
        // PROFILE
        // =================================================

        console.log(
            `Profile API: http://localhost:${PORT}/api/profile`
        );


        // =================================================
        // SKILLS
        // =================================================

        console.log(
            `Skills API: http://localhost:${PORT}/api/skills`
        );

        console.log(
            `Skills Info API: http://localhost:${PORT}/api/skills-info`
        );


        // =================================================
        // COURSES
        // =================================================

        console.log(
            `Courses API: http://localhost:${PORT}/api/courses`
        );

        console.log(
            `Courses Info API: http://localhost:${PORT}/api/courses-info`
        );


        // =================================================
        // FILES
        // =================================================

        console.log(
            `Files API: http://localhost:${PORT}/api/files`
        );


        // =================================================
        // NOTIFICATIONS
        // =================================================

        console.log(
            `Notifications API: http://localhost:${PORT}/api/notifications`
        );


        // =================================================
        // MESSAGES
        // =================================================

        console.log(
            `Messages API: http://localhost:${PORT}/api/messages`
        );

        console.log(
            `Send Message: POST http://localhost:${PORT}/api/messages/send`
        );

        console.log(
            `Get Conversation: GET http://localhost:${PORT}/api/messages/conversation/:userId`
        );

        console.log(
            `Mark Message Read: PUT http://localhost:${PORT}/api/messages/read/:id`
        );


        // =================================================
        // SOCKET
        // =================================================

        console.log(
            `Socket.IO: http://localhost:${PORT}`
        );


        console.log(
            "======================================"
        );

        console.log("");

    }
);