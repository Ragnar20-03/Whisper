import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./App.css";

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <Router>
      <div className="bg-black h-20 w-full text-center">
        <h1 className="text-3xl text-white">Whisper</h1>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={
            <ErrorBoundary>
              <ChatPage />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  const handleConnect = () => {
    // Navigate to the chat page with the username as query parameter
    navigate("/chat", { state: { username } });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <label className="p-3 m-3" htmlFor=" ">
        Enter username
      </label>
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        name=""
        id=""
      />
      <button
        onClick={handleConnect}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Connect
      </button>
    </div>
  );
};

const ChatPage = () => {
  const location = useLocation();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  // Ensure username is set from location.state or default to "Anonymous"
  const username = location.state?.username || "Anonymous";

  useEffect(() => {
    const newSocket = new WebSocket("wss://13.211.152.31:5100");
    setSocket(newSocket);

    newSocket.onopen = () => {
      // Send the username to the backend as soon as the socket is open
      if (username) {
        newSocket.send(JSON.stringify({ type: "setUsername", username }));
      }
    };

    // Handle incoming messages
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "init") {
        setChatMessages(data.messages);
      } else if (data.type === "newMessage") {
        setChatMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      newSocket.close();
    };
  }, [username]);

  const sendMessage = () => {
    if (messageInput.trim() === "" || !socket) {
      console.error("Socket is not initialized or message is empty");
      return;
    }

    // Send the message as a JSON object to the backend
    const message = { type: "newMessage", message: messageInput };
    socket.send(JSON.stringify(message));

    // Update local state with the sent message
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: username || "Unknown", message: messageInput },
    ]);

    // Clear input field
    setMessageInput("");
  };

  return (
    <div className="h-96 border-spacing-2 border p-4">
      <div className="chat-box-header h-10">
        <p>Ekach Wada Whisper Dada</p>
      </div>
      <div
        className="chat-box-content overflow-y-scroll h-72 border-t mt-2"
        style={{ maxHeight: "300px", border: "1px solid #ccc" }}
      >
        {chatMessages.map((chat, index) => (
          <div
            key={index}
            className={`message p-2 my-1 rounded ${
              chat.sender === username
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
};

export default App;
