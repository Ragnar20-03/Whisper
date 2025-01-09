import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";

export const Home: React.FC = () => {
  const [showJoinInputs, setShowJoinInputs] = useState(false);
  const [showCreateInputs, setShowCreateInputs] = useState(false);
  const userName = useSelector((state: RootState) => state.user.username);
  const dispatch = useDispatch();
  const [roomCode, setRoomCode] = useState<string | any>("");
  const [roomName, setRoomName] = useState<string | any>("");

  // Handlers for showing inputs
  const handleJoinClick = () => {
    setShowJoinInputs(true);
    setShowCreateInputs(false);
  };

  const handleCreateClick = () => {
    setShowCreateInputs(true);
    setShowJoinInputs(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-teal-800 text-white">
      {/* Whisper Logo */}
      <h1 className="text-5xl font-bold mb-8">Whisper</h1>
      {/* Buttons to Join or Create Room */}

      <input
        type="text"
        placeholder="Enter Username"
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg"
        onChange={(e) => {
          dispatch(setUser(e.target.value));
        }}
      />
      <br />

      <div className="flex space-x-4">
        <button
          className="bg-blue-500 py-2 px-6 rounded-lg"
          onClick={handleJoinClick}
        >
          Join Room
        </button>
        <button
          className="bg-green-500 py-2 px-6 rounded-lg"
          onClick={handleCreateClick}
        >
          Create Room
        </button>
      </div>
      {/* Conditional Rendering for Join Room Inputs */}
      {showJoinInputs && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Room Code"
            className="mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setRoomCode(e.target.value);
            }}
          />
          <br />

          <br />

          <button className="bg-blue-600 py-2 px-6 rounded-lg">
            Join Room
          </button>
        </div>
      )}
      {/* Conditional Rendering for Create Room Inputs */}
      {showCreateInputs && (
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Room Name"
            className="mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
          <br />

          <br />
          <button className="bg-green-600 py-2 px-6 rounded-lg">
            Create Room
          </button>
        </div>
      )}
    </div>
  );
};
