import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "../store";
import { setSocket } from "../slices/socketSlice";
import { useNavigate } from "react-router-dom";
import { setRoom } from "../slices/roomSlice";

export const JoinRoom: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const socket = useSelector((state: RootState) => state.socket.socket);
  const [roomCode, setRoomCode] = useState<string>("");

  useEffect(() => {
    if (!socket) {
      navigate("/");
    } else {
      const handleMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        console.log("data is : ", data);
        dispatch(setRoom({ roomName: data.roomName }));
      };

      socket.onmessage = handleMessage;

      return () => {
        if (socket) {
          socket.onmessage = null;
        }
      };
    }
  }),
    [socket, roomCode, navigate];

  const onJoinHandler = () => {
    let req = { type: "init", username: username };
    socket?.send(JSON.stringify(req));
    req = { type: "join_room", username: username, roomCode: roomCode } as {
      type: string;
      username: string;
      roomCode: string;
    };
    socket?.send(JSON.stringify(req));
  };
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder=" Enter Username "
        name=""
        id=""
      />
      <input
        type="text"
        onChange={(e) => {
          setRoomCode(e.target.value);
        }}
        placeholder="Enter Room Code "
        name=""
        id=""
      />
      <button onClick={onJoinHandler}>JOIN</button>
    </div>
  );
};
