const express = require("express");

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get my notifications
// GET /api/notifications
router.get(
    "/",
    protect,
    getMyNotifications
);


// Mark one notification as read
// PUT /api/notifications/:id/read
router.put(
    "/:id/read",
    protect,
    markAsRead
);


// Mark all notifications as read
// PUT /api/notifications/read-all
router.put(
    "/read-all",
    protect,
    markAllAsRead
);


module.exports = router;