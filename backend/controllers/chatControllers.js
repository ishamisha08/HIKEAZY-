import { conversationModel } from '../models/conversationModel.js';
import { getUser, io } from '../server.js'; // Assuming these are exported from your server setup

// Start a new conversation or get the existing one
const startConversation = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ success: false, message: "SenderId and ReceiverId are required" });
    }

    try {
        // Check if conversation already exists
        let conversation = await conversationModel.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (!conversation) {
            // Create a new conversation
            conversation = new conversationModel({
                sender: senderId,
                receiver: receiverId,
                messages: [],
            });
            await conversation.save();
        }

        res.status(200).json({ success: true, conversation });
    } catch (error) {
        console.error("Error starting conversation:", error);
        res.status(500).json({ success: false, message: "Error starting conversation", error });
    }
};

// Send a new message in an existing conversation
const sendMessage = async (req, res) => {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
        return res.status(400).json({ success: false, message: "SenderId, ReceiverId, and Text are required." });
    }

    try {
        // Find the conversation or create a new one
        let conversation = await conversationModel.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (!conversation) {
            conversation = new conversationModel({
                sender: senderId,
                receiver: receiverId,
                messages: [],
            });
        }

        // Add the new message to the conversation
        const newMessage = {
            senderId, // Ensure `senderId` is set
            text,
            seen: false,
        };
        conversation.messages.push(newMessage);
        await conversation.save();

        // Real-time message delivery
        const receiver = getUser(receiverId); // Retrieve receiver's socketId
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", newMessage);
        }

        res.status(200).json({ success: true, message: "Message sent successfully.", newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Error sending message.", error: error.message });
    }
};


// Get all messages in a conversation
const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;

    if (!senderId || !receiverId) {
        return res.status(400).json({ success: false, message: "SenderId and ReceiverId are required." });
    }

    try {
        const conversation = await conversationModel.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found." });
        }

        res.status(200).json({ success: true, messages: conversation.messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Error fetching messages.", error });
    }
};

// Mark message as seen
const markAsSeen = async (req, res) => {
    const { messageId, senderId, receiverId } = req.body;

    if (!messageId || !senderId || !receiverId) {
        return res.status(400).json({ success: false, message: "MessageId, SenderId, and ReceiverId are required." });
    }

    try {
        // Find the conversation and message
        const conversation = await conversationModel.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: "Conversation not found." });
        }

        // Find the message and update its `seen` field
        const message = conversation.messages.id(messageId);
        if (message) {
            message.seen = true;
            await conversation.save();
            res.status(200).json({ success: true, message: "Message marked as seen." });
        } else {
            res.status(404).json({ success: false, message: "Message not found." });
        }
    } catch (error) {
        console.error("Error marking message as seen:", error);
        res.status(500).json({ success: false, message: "Error marking message as seen.", error });
    }
};

export { startConversation, sendMessage, getMessages, markAsSeen };
