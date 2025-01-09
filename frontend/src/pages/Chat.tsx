import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Chat: React.FC = () => {
  const { roomName, roomCode } = useSelector((state: RootState) => state.room);
  const { username, isAdmin } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    console.log("isAdmin : ", isAdmin);
  }, []);
  return (
    <div>
      <h1>
        Room Name : {roomName} , RoomCode : {roomCode}
      </h1>
      {isAdmin == true ? (
        <div> You Are Admin </div>
      ) : (
        <div> You are client</div>
      )}
    </div>
  );
};

export default Chat;
