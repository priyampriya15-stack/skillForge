
const express = require("express");

const {
    sendMessage,
    getConversation,
    markAsRead
} = require("../controllers/messageController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// SEND MESSAGE

router.post(
    "/send",
    protect,
    sendMessage
);


// GET CONVERSATION

router.get(
    "/conversation/:userId",
    protect,
    getConversation
);


// MARK MESSAGE AS READ

router.put(
    "/read/:id",
    protect,
    markAsRead
);


module.exports = router;

