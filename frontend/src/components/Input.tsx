import React, { useState } from "react";

function Input({ socket }: { socket: WebSocket | null }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      // Send the message over WebSocket
      socket.send(message);

      // Add the message to the local chat as the sender
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="p-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-black w-96 p-3 rounded-md"
        placeholder="Enter message"
      />
      <button
        className="bg-orange-400 rounded-md p-3 text-lg"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default Input;
