import React, { useState, useEffect, useRef } from "react";

interface ChatMessage {
  sender: string;
  message: string;
}

function ChatBoxHeader({ socket }: { socket: WebSocket | null }) {
  // State to store the chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  // Ref to track the chat container element for scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Listen for incoming messages from WebSocket
  useEffect(() => {
    if (!socket) return;

    // WebSocket message handler
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") {
        // Initial messages sent from the server to the new client
        setChatMessages(data.messages);
      } else if (data.type === "newMessage") {
        // New messages broadcast from the server
        setChatMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    return () => {
      // Clean up WebSocket connection when the component is unmounted
      socket.close();
    };
  }, [socket]); // Effect will run when socket is updated

  // Handle sending a new message
  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    // Add the new message to the local chat state immediately
    const newMessage = { sender: "User", message: messageInput };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the message to the WebSocket server
    if (socket) {
      socket.send(messageInput);
    }

    // Clear the message input after sending
    setMessageInput("");
  };

  // Scroll to the bottom of the chat container after new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]); // Scroll when chatMessages change

  return (
    <div className="h-96 border-spacing-2 border p-4">
      <div className="chat-box-header h-10">
        <p>Ekach Wada Whisper Dada</p>
      </div>
      <div
        ref={chatContainerRef} // Reference to the chat container
        className="chat-box-content overflow-y-scroll h-72 border-t mt-2"
        style={{ maxHeight: "300px", border: "1px solid #ccc" }}
      >
        {chatMessages.map((chat, index) => (
          <div
            key={index}
            className={`message p-2 my-1 rounded ${
              chat.sender === "User"
                ? "bg-blue-100 self-end"
                : "bg-gray-100 self-start"
            }`}
          >
            <p className="font-bold">{chat.sender}:</p>
            <p>{chat.message}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2 w-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBoxHeader;
