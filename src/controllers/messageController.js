const Message = require("../models/Message");


// ===============================
// SEND MESSAGE
// ===============================

const sendMessage = async (req, res, next) => {

    try {

        const {
            receiver,
            message
        } = req.body;


        // Check receiver

        if (!receiver) {

            return res.status(400).json({

                success: false,

                message: "Receiver is required"

            });

        }


        // Check message

        if (!message || message.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Message is required"

            });

        }


        // Create message

        const newMessage = await Message.create({

            sender: req.user._id,

            receiver: receiver,

            message: message.trim()

        });


        // Populate sender and receiver

        const populatedMessage =
            await Message.findById(newMessage._id)
                .populate(
                    "sender",
                    "name email role"
                )
                .populate(
                    "receiver",
                    "name email role"
                );


        res.status(201).json({

            success: true,

            message: "Message sent successfully",

            data: populatedMessage

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// GET CONVERSATION
// ===============================

const getConversation = async (req, res, next) => {

    try {

        const otherUserId =
            req.params.userId;


        const currentUserId =
            req.user._id;


        const messages =
            await Message.find({

                $or: [

                    {
                        sender: currentUserId,
                        receiver: otherUserId
                    },

                    {
                        sender: otherUserId,
                        receiver: currentUserId
                    }

                ]

            })
                .populate(
                    "sender",
                    "name email role"
                )
                .populate(
                    "receiver",
                    "name email role"
                )
                .sort({
                    createdAt: 1
                });


        res.status(200).json({

            success: true,

            count: messages.length,

            data: messages

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// MARK MESSAGE AS READ
// ===============================

const markAsRead = async (req, res, next) => {

    try {

        const messageId =
            req.params.id;


        const message =
            await Message.findById(messageId);


        if (!message) {

            return res.status(404).json({

                success: false,

                message: "Message not found"

            });

        }


        // Only receiver can mark as read

        if (
            message.receiver.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You cannot mark this message as read"

            });

        }


        message.isRead = true;

        await message.save();


        res.status(200).json({

            success: true,

            message: "Message marked as read",

            data: message

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// EXPORT
// ===============================

module.exports = {

    sendMessage,

    getConversation,

    markAsRead

};