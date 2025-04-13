"use client";

import { useConvex, useMutation } from "convex/react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Context } from "@/context/Context";
import Image from "next/image";
import { ArrowRight, Link as LinkIcon, Sidebar, Menu as SidebarIcon } from "lucide-react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Prompt from "@/data/Prompt";
import { useSidebar } from "../ui/sidebar";

// export const countToken = (inputText) => {
//   return inputText.trim().split(/\s+/).filter(word => word).length;
// };

const Chatview = () => {
  const { id } = useParams();
  const convex = useConvex();
  const [UserInput, setUserInput] = useState("");
  const { Messages, setMessages, UserDetails } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const updateMessages = useMutation(api.workspace.updateWorkSpace);
  const messagesEndRef = useRef(null);
  const { toggleSidebar } = useSidebar();
  // const updateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    if (id) getWorkSpaceData();
  }, [id]);

  const getWorkSpaceData = async () => {
    const result = await convex.query(api.workspace.getWorkSpace, {
      workspaceId: id,
    });
    setMessages(result?.messages || []);
  };

  useEffect(() => {
    if (!Messages.length) return;

    const lastMessage = Messages[Messages.length - 1];
    if (lastMessage.role === "user") {
      getAiResponse();
    }

    scrollToBottom();
  }, [Messages]);

  const getAiResponse = async () => {
    setLoading(true);
    try {
      const lastMessage = Messages[Messages.length - 1];
      const promptText = `${lastMessage.content}\n${Prompt.CHAT_PROMPT}`;

      const { data } = await axios.post("/api/ai-chat", {
        prompt: promptText,
      });

      const aiResponse = { role: "ai", content: data.result };
      const updatedMessages = [...Messages, aiResponse];
      setMessages(updatedMessages);

      // const token = Number(UserDetails?.token ?? 0) - countToken(JSON.stringify(aiResponse));
      // await updateTokens({
      //   userId: UserDetails?._id || "",
      //   token,
      // });

      await updateMessages({
        messages: updatedMessages,
        workspaceId: id,
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const generate = (text) => {
    if (text.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setUserInput("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[90vh] mt-14 px-5 py-4">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto bg-black scrollbar-hide p-4 rounded-xl">
        {Array.isArray(Messages) &&
          Messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl mb-4 max-w-[73%] transition-all ${
                msg.role === "ai"
                  ? "bg-[#2a2a2a] ml-12 text-white shadow-blue-glow"
                  : "bg-blue-600 text-white self-end mr-4 shadow-user-glow"
              }`}
            >
              {msg.role === "user" && UserDetails?.picture && (
                <Image
                  src={UserDetails.picture}
                  alt="User Image"
                  width={36}
                  height={36}
                  className="rounded-full mb-2"
                />
              )}
              <p className="text-sm whitespace-pre-line break-words">{msg.content}</p>
            </div>
          ))}

        {loading && (
          <div className="flex justify-start gap-3 items-center py-4 bg-transparent px-4">
            <ClipLoader color="#3b82f6" loading={loading} size={28} />
            <h2 className="text-blue-400 drop-shadow-glow">Generating response...</h2>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="mt-4 w-full max-w-4xl mx-auto">
        <div className="p-5 border border-blue-500 rounded-xl bg-[#111] shadow-xl shadow-blue-500/20">
          <div className="flex gap-2">
            <textarea
              value={UserInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-28 max-h-56 resize-none text-white placeholder:text-gray-500"
              placeholder="What you want to build"
            />
            {UserInput && (
              <ArrowRight
                onClick={() => generate(UserInput)}
                className="bg-blue-500 hover:bg-blue-600 transition h-10 w-10 p-2 rounded-md cursor-pointer mt-2"
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <LinkIcon />
            {UserDetails && <SidebarIcon onClick={toggleSidebar} className="cursor-pointer" />}
          </div>
        </div>
      </div>

      {/* Glow effect styles */}
      <style jsx>{`
        .drop-shadow-glow {
          text-shadow: 0 0 8px rgba(59, 130, 246, 0.8), 0 0 12px rgba(59, 130, 246, 0.5);
        }
        .shadow-blue-glow {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .shadow-user-glow {
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.6), 0 0 14px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Chatview;
