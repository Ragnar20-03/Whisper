import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { setRoom } from "../slices/roomSlice";

function Chat() {
  // Define the message interface
  interface IMsg {
    username: string;
    message: string;
    timeStamp: Date;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const room = useSelector((state: RootState) => state.room);
  const user = useSelector((state: RootState) => state.user);
  const socket = useSelector((state: RootState) => state.socket.socket); // Access the socket from Redux store

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMsg[]>([]); // To store the messages in an array

  // When the component mounts or socket changes, we set up the WebSocket listeners
  useEffect(() => {
    if (user.username === "User") {
      alert("Please enter a username!");
      navigate("/jroom"); // Redirect to the room creation page if the username is "User"
    }

    // Check if the WebSocket is initialized
    if (socket) {
      console.log("ROom State is : ", room);

      // Listen for incoming messages
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type == "success") {
          console.log("data is : roshan", data);
          dispatch(
            setRoom({ roomName: data.roomName, roomCode: data.roomCode })
          );
        }

        if (data.type === "in_msg" && data.username && data.message) {
          // Add the incoming message to the message list
          const newMessage: IMsg = {
            username: data.username === user.username ? "You" : data.username, // Add username from the received data
            message: data.message, // Add message from the received data
            timeStamp: new Date(), // Add current timestamp for when the message was received
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };
    }

    // Cleanup the WebSocket event listener when the component unmounts or the socket changes
    return () => {
      if (socket) {
        socket.onmessage = null; // Clean up the socket listener
      }
    };
  }, [socket, user.username, navigate, room]);

  // Function to handle sending messages
  const sendMessage = () => {
    console.log("username is : ", user.username.username);

    if (socket && message.trim()) {
      const messageData = {
        type: "new_msg",
        username: user.username.username,
        message: message,
        roomCode: room.roomCode,
      };
      socket.send(JSON.stringify(messageData)); // Send the message through the socket
      let newMessage: IMsg = {
        username: "You",
        timeStamp: new Date(),
        message,
      };

      setMessage(""); // Clear the message input field
    }
  };

  return (
    <div className="chat-container">
      <div className="bg-black h-20 text-white flex justify-center m-3 p-3">
        <h1>
          Room Name: {room.roomName} &&&&&& RoomCode: {room.roomCode}
        </h1>
      </div>

      {/* Display all messages */}
      <div className="message-list">
        {messages.map((msg, index) => {
          console.log("msg is : ", msg);

          return (
            <div key={index} className="message-item">
              {/* Ensure message and username are valid */}
              <span className="font-bold">
                {msg.username || "Unknown"}
              </span>: <span>{msg.message || "No message"}</span>
            </div>
          );
        })}
      </div>

      {/* Input field for sending a new message */}
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="p-2 m-3 rounded-lg border-black"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-400 p-2 rounded-md text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
