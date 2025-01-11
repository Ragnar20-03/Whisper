import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import CreateRoom from "./components/CreateRoom";
import { JoinRoom } from "./components/JoinRoom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/croom" element={<CreateRoom />} />
          <Route path="/jroom" element={<JoinRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
