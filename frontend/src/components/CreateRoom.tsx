import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setUser } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { setSocket } from "../slices/socketSlice";
import { setRoom } from "../slices/roomSlice";

function CreateRoom() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const socket = useSelector((state: RootState) => state.socket);
  const room = useSelector((state: RootState) => state.room);

  useEffect(() => {
    if (socket?.socket) {
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        // Handle the "room created" message from the server
        if (data.status === "success") {
          dispatch(
            setRoom({ roomName: roomName, roomCode: data.room.roomCode })
          );
          console.log("data is : ", data);
          console.log("state is : ", room);
        }
        navigate("/chat");
      };

      socket.socket.onmessage = handleMessage;

      // Cleanup on unmount
      return () => {
        if (socket.socket) {
          socket.socket.onmessage = null;
        }
      };
    }
  }, [socket, roomName, navigate]);

  return (
    <div className=" flex justify-center h-96 flex-col  items-center  border-slate-600 ">
      <div className=" bg-black p-2 m-2 rounded-md text-white w-96 flex justify-center">
        <h1> Create Room </h1>
      </div>
      <div>
        <span> Username </span>{" "}
        <input
          type="text"
          name=""
          placeholder="Enter Username"
          className="p-2 m-3 rounded-lg border-black "
          id=""
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className=" flex justify-center flex-col">
        <div>
          <span>Room Name</span>
          <input
            type="text"
            placeholder="Enter Room Name"
            className=" p-2 m-3 rounded-lg border-black "
            name=""
            id=""
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
        </div>
        <button
          className={`bg-teal-400 p-2 m-3 rounded-md text-black `}
          type={username === "" ? "button" : "submit"}
          disabled={username === ""}
          onClick={() => {
            dispatch(setUser({ username: username, isAdmin: true }));
            if (!socket) {
              let nSocket = new WebSocket(
                "https://ctfvhw32-5100.inc1.devtunnels.ms/"
              );
              dispatch(setSocket({ socket: nSocket }));
            }

            let req = { type: "init", username: username };
            console.log("coonnecting!!");
            socket.socket?.send(JSON.stringify(req));
            req = {
              type: "init_room",
              username: username,
              roomName: roomName,
            } as { type: string; username: string; roomName: string };
            socket.socket?.send(JSON.stringify(req));
          }}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
