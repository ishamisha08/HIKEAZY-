import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const ChatApp = ({ currentUserId, receiverId }) => {
  const [messages, setMessages] = useState([]); // Chat history
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    socket.current = io("http://localhost:4000", { withCredentials: true });

    // Listen for incoming messages
    socket.current.on("getMessage", (message) => {
      if (message.senderId === receiverId) {
        setMessages((prev) => [...prev, message]); // Add new message to the chat
      }
    });

    // Add current user to the Socket.IO server
    if (currentUserId) {
      socket.current.emit("addUser", currentUserId);
    }

    return () => {
      socket.current.disconnect(); // Clean up socket connection
    };
  }, [currentUserId, receiverId]);

  // Fetch chat history when `receiverId` changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId) return; // If no receiver is selected, do nothing

      try {
        const response = await fetch(`http://localhost:4000/api/chat/${currentUserId}/${receiverId}`);
        const data = await response.json();

        if (data.success) {
          setMessages(data.messages); // Load persisted messages from the backend
        } else {
          console.error("Failed to fetch messages:", data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [receiverId, currentUserId]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages

    const message = {
      senderId: currentUserId,
      receiverId,
      text: newMessage,
    };

    try {
      // Send the message to the backend
      const response = await fetch("http://localhost:4000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { senderId: currentUserId, text: newMessage }, // Add the message locally
        ]);

        socket.current.emit("sendMessage", message); // Emit the message to the receiver in real-time
        setNewMessage(""); // Clear the input field
      } else {
        console.error("Error sending message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="chat-container p-4 flex flex-col h-full"
      style={{
        background: "linear-gradient(145deg, #2d2d2d, #3b3b3b)", // Subtle gradient
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Messages Section */}
      <div
        className="messages flex-1 overflow-y-auto p-4 rounded-lg"
        style={{
          maxHeight: "70vh", // Restrict height for scrolling
          backgroundColor: "#3b3b3b",
          borderRadius: "15px",
          overflowY: "scroll", // Enable vertical scrolling
          boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-3 p-3 rounded-xl ${
              msg.senderId === currentUserId
                ? "ml-auto text-white"
                : "mr-auto text-black"
            }`}
            style={{
              backgroundColor:
                msg.senderId === currentUserId ? "#ff944d" : "#e6e6e6", // Muted orange for sender, light gray for receiver
              maxWidth: "70%", // Limit the bubble width
              wordBreak: "break-word", // Break long text
              textAlign: "left",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-l-xl bg-gray-800 text-white focus:outline-none"
          style={{
            boxShadow: "inset 0px 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-3 rounded-r-xl transition"
          disabled={!receiverId} // Disable button if no receiver is selected
          style={{
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
