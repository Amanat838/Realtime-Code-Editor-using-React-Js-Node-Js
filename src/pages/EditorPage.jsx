import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import { useLocation } from "react-router-dom";

const EditorPage = () => {
  const location = useLocation();

  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect", () => {
        console.log("Connected to server:", socketRef.current.id);
      });
    };
    init();
  }, []);
  const [clients, setClients] = useState([
    { socketId: 1, username: "Amanat" },
    { socketId: 2, username: "Zilly" },
    { socketId: 2, username: "Zilly" },
    { socketId: 2, username: "Zilly" },
    { socketId: 2, username: "Zilly" },
  ]);
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
