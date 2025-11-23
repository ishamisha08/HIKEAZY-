import express from 'express';
import { getMessages, markAsSeen, sendMessage, startConversation } from '../controllers/chatControllers.js';

const chatRouter = express.Router();

// Start a new conversation or get an existing one
chatRouter.post('/start', startConversation);

// Send a message
chatRouter.post('/send', sendMessage);

// Get messages for a specific conversation
chatRouter.get('/:senderId/:receiverId', getMessages);

// Mark a message as seen
chatRouter.post('/mark-seen', markAsSeen);


export default chatRouter;
