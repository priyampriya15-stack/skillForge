// ===============================
// LOAD ENVIRONMENT VARIABLES
// ===============================

const dotenv = require("dotenv");

dotenv.config();


// ===============================
// IMPORT PACKAGES
// ===============================

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


// ===============================
// CONFIG
// ===============================

const connectDB = require("./config/db");


// ===============================
// ROUTES
// ===============================

const authRoutes =
    require("./routes/authRoutes");

const userRoutes =
    require("./routes/userRoutes");

const projectRoutes =
    require("./routes/projectRoutes");

const proposalRoutes =
    require("./routes/proposalRoutes");

const milestoneRoutes =
    require("./routes/milestoneRoutes");

const reviewRoutes =
    require("./routes/reviewRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

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

// ⭐ MESSAGE ROUTES
const messageRoutes =
    require("./routes/messageRoutes");


// ===============================
// ERROR MIDDLEWARE
// ===============================

const errorHandler =
    require("./middleware/errorMiddleware");


// ===============================
// RAZORPAY ENV CHECK
// ===============================

console.log(
    "Razorpay Key:",
    process.env.RAZORPAY_KEY_ID
        ? "Loaded"
        : "Missing"
);


// ===============================
// CONNECT MONGODB
// ===============================

connectDB();


// ===============================
// CREATE EXPRESS APP
// ===============================

const app = express();


// ===============================
// CREATE HTTP SERVER
// ===============================

const server = http.createServer(app);


// ===============================
// SOCKET.IO
// ===============================

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST"
        ]

    }

});


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ===============================
// UPLOADED FILES
// ===============================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// ===============================
// TEST SERVER
// ===============================

app.get("/", (req, res) => {

    res.send(
        "Freelance Platform API Running..."
    );

});


// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/projects",
    projectRoutes
);

app.use(
    "/api/applications",
    applicationRoutes
);

app.use(
    "/api/proposals",
    proposalRoutes
);

app.use(
    "/api/milestones",
    milestoneRoutes
);

app.use(
    "/api/reviews",
    reviewRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);


// ⭐ MESSAGE ROUTES

app.use(
    "/api/messages",
    messageRoutes
);


// ===============================
// EMAIL ROUTES
// ===============================

app.use(
    "/api/email",
    emailRoutes
);


// ===============================
// FILE ROUTES
// ===============================

app.use(
    "/api/files",
    fileRoutes
);


// ===============================
// PAYMENT ROUTES
// ===============================

app.use(
    "/api/payments",
    paymentRoutes
);


// ===============================
// SOCKET.IO EVENTS
// ===============================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );


    // ===============================
    // JOIN CHAT ROOM
    // ===============================

    socket.on(
        "joinRoom",
        (roomId) => {

            socket.join(roomId);

            console.log(
                `User joined room: ${roomId}`
            );

        }
    );


    // ===============================
    // SEND MESSAGE
    // ===============================

    socket.on(
        "sendMessage",
        (data) => {

            io.to(data.roomId).emit(
                "receiveMessage",
                {

                    sender: data.sender,

                    message: data.message,

                    roomId: data.roomId,

                    createdAt: new Date()

                }
            );

        }
    );


    // ===============================
    // DISCONNECT
    // ===============================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        }
    );

});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


// ===============================
// SERVER START
// ===============================

const PORT =
    process.env.PORT || 5000;


// IMPORTANT:
// Use server.listen()
// NOT app.listen()
// because Socket.IO is attached
// to the HTTP server.

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);