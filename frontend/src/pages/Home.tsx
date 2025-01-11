import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSocket } from "../slices/socketSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function Home() {
  const dispatch = useDispatch();
  const socket = useSelector((state: RootState) => state.socket.socket);
  useEffect(() => {
    const newSocket = new WebSocket(
      "https://ctfvhw32-5100.inc1.devtunnels.ms/"
    );
    dispatch(setSocket({ socket: newSocket }));
    if (socket) {
      socket.onopen = () => {
        dispatch(setSocket({ socket: socket }));
        console.log("/connection established !");
      };
      socket.onerror = () => {
        alert("Unable to join / create room");
        navigate("/jroom");
      };
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="">
        <div className="w-full flex flex-col items-center  ">
          <button
            type="submit"
            className="bg-black rounded-md text-white p-2 m-2 justify-start"
            onClick={() => {
              navigate("/croom");
            }}
          >
            {" "}
            Create Room
          </button>
          <button
            type="submit"
            className="bg-black rounded-md text-white p-2 m-2 justify-start"
            onClick={() => {
              navigate("/jroom");
            }}
          >
            {" "}
            Join Room{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
