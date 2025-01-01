import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ChatPage from "./ChatPage";

function HomePage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomCode && username) {
      navigate("/chat", { state: { roomCode, username } });
    } else {
      alert("Please enter Room Code and Username");
    }
  };

  const handleCreateRoom = () => {
    if (roomName && username) {
      // You could also handle room creation logic here, e.g., via API/WebSocket.
      const generatedRoomCode = Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase();
      navigate("/chat", { state: { roomCode: generatedRoomCode, username } });
    } else {
      alert("Please enter Room Name and Username");
    }
  };

  return (
    <div className="p-3 m-3 flex-col justify-center">
      <div>
        <h1 className="bg-black text-white text-xl h-12 flex justify-center">
          Chat Application
        </h1>
      </div>

      <div className="flex justify-center flex-row bg-slate-600 border-black p-3 m-3">
        <div className="flex justify-center w-3/4 h-96">
          <div className="flex justify-center w-50 flex-col">
            <input
              type="text"
              placeholder="Enter Room Code"
              className="rounded-md m-2 p-2 border border-black"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button
              onClick={handleJoinRoom}
              className="p-3 m-3 rounded-md bg-teal-700 text-black"
            >
              Join Room
            </button>
            <input
              type="text"
              placeholder="Enter Room Name"
              className="rounded-md m-2 p-2 border border-black"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter User Name"
              className="rounded-md m-2 p-2 border border-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={handleCreateRoom}
              className="p-3 m-3 rounded-md bg-teal-700 text-black"
            >
              Create Room
            </button>
          </div>
          <div className="flex items-center px-16 justify-center w-30">
            <h1 className="text-xl">Whisper (Connect with people ...!)</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
