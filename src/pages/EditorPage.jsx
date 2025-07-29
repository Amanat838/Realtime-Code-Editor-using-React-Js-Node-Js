import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  // console.log(params)
  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      // Disconnect existing socket first (safety)
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socket = await initSocket();
      socketRef.current = socket;

      // Debug all events
      socket.onAny((event, ...args) => {
        console.log("📩 Event received:", event, args);
      });

      // Handle connection errors
      const handleErrors = (e) => {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again");
        reactNavigator("/");
      };
      socket.on("connect_error", handleErrors);
      socket.on("connect_failed", handleErrors);

      // ✅ Register listener before emitting JOIN
      socket.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined with id ${socketId}`);
        }

        // Deduplicate clients
        const uniqueClients = Array.from(
          new Map(clients.map((c) => [c.socketId, c])).values()
        );
        setClients(uniqueClients);
      });

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{
        toast.success(`${username} left the room`)
        setClients((prev)=>{
          return prev.filter(client => client.socketId != socketId)
        })
      })

      // Emit join
      socket.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED)
        socketRef.current.off(ACTIONS.DISCONNECTED)
        console.log("🔌 Disconnected socket on unmount");
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="bg-[#1c1e29] h-screen grid grid-cols-[230px_1fr]">
      <div className="bg-[#1c1e29] p-[16px] text-white h-full flex flex-col justify-between">
        <div>
          <div className="border-b border-[#424242] mb-4 borde h-[50px] flex items-center">
            <img
              className="block max-w-[150px] h-[60px]]"
              src="/livecodex.png"
              alt=""
            />
          </div>
          <h3 className="text-white font-bold mb-3">Connected</h3>
          <div className="flex gap-2 flex-wrap">
            {clients.map((client) => {
              return (
                <Client key={client.socketId} username={client.username} />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 bottom-0">
          <button className="bg-white text-black cursor-pointer border border-black p-[10px] rounded-lg w-[100%] font-bold">
            Copy Room Id
          </button>
          <button className="text-black bg-[#4aed88] hover:bg-[#2b824c] cursor-pointer border border-black p-[10px] rounded-lg w-[100%] font-bold">
            Leave
          </button>
        </div>
      </div>

      <div>
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
