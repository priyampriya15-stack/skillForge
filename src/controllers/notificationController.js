const Notification = require("../models/Notification");


// =====================================================
// CREATE NOTIFICATION
// =====================================================
const createNotification = async (userId, message, type = "system") => {
    try {
        const notification = await Notification.create({
            user: userId,
            message,
            type
        });

        return notification;

    } catch (error) {
        console.error(
            "Notification creation failed:",
            error.message
        );

        return null;
    }
};


// =====================================================
// GET MY NOTIFICATIONS
// =====================================================
const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({
            user: req.user._id
        })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// MARK NOTIFICATION AS READ
// =====================================================
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================
const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            {
                user: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        next(error);
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    markAllAsRead
};
