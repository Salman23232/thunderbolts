"use client";

import { Context } from "@/context/Context";
import Lookup from "../../data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import { useContext, useState } from "react";
import Signin from "./Signin";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Header from "./Header";

const SUGGESTIONS = [
  "Create a simple to-do list app",
  "Build a weather app with live updates",
  "Design a personal portfolio website",
  "Generate a random quote generator",
  "Create a notes-taking app",
];

const Hero = () => {
  const [UserInput, setUserInput] = useState("");
  const { Messages, setMessages, UserDetails, setUserDetails } = useContext(Context);
  const createWorkspace = useMutation(api.workspace.createWorkSpace);
  const [OpenDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const generate = async (input) => {
    if (!UserDetails?.name) {
      setOpenDialog(true);
      
      return;
    }
    const msg = {
      role: "user",
      content: input,
    };
    if (!UserDetails?._id) {
      console.error("Convex user ID not found");
      return;
    }
    setMessages(msg);
    const workspaceId = await createWorkspace({
      messages: [msg],
      user: UserDetails._id,
    });
    console.log(workspaceId);
    router.push("/workspace/" + workspaceId);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden w-full">
      <div className="flex flex-col items-center justify-center text-center px-4 pt-40 gap-4">
        <h2 className="text-5xl font-bold drop-shadow-glow">
          What do you want to <span className="text-blue-500">build</span>?
        </h2>
        <p className="text-gray-400 font-medium">
          Prompt, run, edit and deploy full-stack web apps.
        </p>
        <div className="flex flex-wrap max-w-2xl items-center justify-center mt-5 gap-2">
          {SUGGESTIONS.map((suggestion, index) => (
            <h2
              className="p-1 px-3 border border-gray-600 rounded-full text-sm text-gray-400 hover:text-white hover:border-white cursor-pointer transition"
              key={index}
              onClick={() => generate(suggestion)}
            >
              {suggestion}
            </h2>
          ))}
        </div>
      </div>

      {/* Input Box at Bottom Center */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="p-5 border border-blue-500 rounded-xl bg-[#111] shadow-xl shadow-blue-500/20">
          <div className="flex gap-2">
            <textarea
              type="text"
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-28 max-h-56 resize-none text-white placeholder:text-gray-500"
              placeholder="What you want to build"
            />
            {UserInput && (
              <ArrowRight
                onClick={() => generate(UserInput)}
                className="bg-blue-500 hover:bg-blue-600 transition h-10 w-10 p-2 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link />
          </div>
        </div>
      </div>

      <Signin OpenDialog={OpenDialog} CloseDialog={(False) => setOpenDialog(False)} />

      {/* Glow effect style */}
      <style jsx>{`
        .drop-shadow-glow {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Hero;
