import ChatBoxHeader from "./chatBoxHeader";

interface ChatBoxProps {
  socket: WebSocket | null;
  username: string;
}

function ChatBox({ socket, username }: ChatBoxProps) {
  return (
    <div className="p-4 m-4 border border-black min-h-96">
      <ChatBoxHeader socket={socket} />
      {/* Here you can use the socket prop to send/receive messages */}
      {/* For now, just log the socket to confirm it's being passed correctly */}
      <div>
        <p> Status: {socket ? "Your Connected" : "Not Connected"}</p>
      </div>
    </div>
  );
}

export default ChatBox;
