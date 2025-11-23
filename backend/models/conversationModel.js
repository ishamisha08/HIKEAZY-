import mongoose from "mongoose";

// Message schema
const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: "",
    }, 
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Add senderId
    imageUrl: {
        type: String,
        default: "",
    },
    videoUrl: {
        type: String,
        default: "",
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Conversation schema
const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user',
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'user',
    },
    messages: [messageSchema], // Array of messages
}, { timestamps: true });

// Create models
const conversationModel = mongoose.models.conversation || mongoose.model('conversation', conversationSchema);

export { conversationModel };
