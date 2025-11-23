import React, { useEffect, useState, useContext } from "react";
import ChatApp from "../components/ChatApp";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets"; // Ensure you have a default image in `assets`

const Chat = () => {
  const { userData, backendUrl } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverImage, setReceiverImage] = useState(""); // To display receiver's image
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/user`);
        setUsers(
          response.data.users.filter((user) => user._id !== userData?._id) // Exclude current user
        );
        setError(null);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userData, backendUrl]);

  // Fetch chat history when receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId) return;

      try {
        const response = await axios.get(
          `${backendUrl}/api/chat/${userData?._id}/${receiverId}`
        );
        if (response.data.success) {
          setMessages(response.data.messages || []);
        } else {
          console.error("Failed to fetch messages:", response.data.message);
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [receiverId, userData, backendUrl]);

  return (
    <div
      className="chat-page flex h-screen"
      style={{
        background: "linear-gradient(145deg, #2d2d2d, #3b3b3b)", // Matching gradient
        color: "white",
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Sidebar: List of users */}
      <div
        className="sidebar w-1/4 p-6 overflow-y-auto"
        style={{
          backgroundColor: "#3b3b3b",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "15px 0 0 15px",
          height: "100%",
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: "#ff944d" }}>
          Users
        </h2>
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setReceiverId(user._id);
                setReceiverName(user.name);
                setReceiverImage(user.image || assets.default_image); // Set receiver's image
              }}
              className={`user-item flex items-center cursor-pointer p-3 mb-2 rounded-lg ${
                receiverId === user._id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-600 text-gray-300"
              } hover:bg-orange-400 transition`}
              style={{
                boxShadow:
                  receiverId === user._id
                    ? "0px 4px 8px rgba(255, 148, 77, 0.3)"
                    : "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                src={user.image || assets.default_image} // Placeholder image for users without images
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <span>{user.name}</span>
            </div>
          ))
        ) : (
          <div>No users found.</div>
        )}
      </div>

      {/* Chat Area */}
      <div
        className="chat-area flex-1 p-6"
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {receiverId ? (
          <>
            <div
              className="header mb-4 p-3 rounded-lg flex items-center"
              style={{
                backgroundColor: "#3b3b3b",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                color: "#ff944d",
              }}
            >
              <img
                src={receiverImage}
                alt={receiverName}
                className="w-12 h-12 rounded-full mr-3"
              />
              <h2 className="text-2xl font-bold">Chat with {receiverName}</h2>
            </div>
            <div style={{ flex: "1" }}>
              <ChatApp
                currentUserId={userData?._id}
                receiverId={receiverId}
                initialMessages={messages}
              />
            </div>
          </>
        ) : (
          <div
            className="text-center text-gray-400"
            style={{
              fontSize: "1.2rem",
              marginTop: "20%",
            }}
          >
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
