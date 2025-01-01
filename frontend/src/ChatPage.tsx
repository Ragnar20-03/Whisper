import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ChatPage() {
  const location = useLocation();
  const { roomCode, username } = location.state || {
    roomCode: "Unknown",
    username: "user",
  };
  useEffect(() => {});
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-black text-white p-4 text-center">
        Room Code: {roomCode}
      </header>
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="chat-message mb-4">
          <strong>{username}</strong>: Welcome to the chat!
        </div>
        {/* Add messages dynamically here */}
      </div>
      <footer className="flex p-4 bg-white border-t">
        <input
          type="text"
          className="flex-1 border rounded-md p-2"
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white p-2 ml-2 rounded-md">
          Send
        </button>
      </footer>
    </div>
  );
}

export default ChatPage;
