"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { ArrowRight, Link } from "lucide-react";
import Spline from "@splinetool/react-spline";

import { Context } from "@/context/Context";
import Signin from "./Signin";
import { api } from "../../../convex/_generated/api";

const SUGGESTIONS = [
  "Create a simple to-do list app",
  "Build a weather app with live updates",
  "Design a personal portfolio website",
  "Generate a random quote generator",
  "Create a notes-taking app",
];

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { setMessages, UserDetails } = useContext(Context);
  const createWorkspace = useMutation(api.workspace.createWorkSpace);
  const router = useRouter();

  const generate = async (input) => {
    if (!UserDetails?.name) {
      setOpenDialog(true);
      return;
    }

    if (!UserDetails?._id) {
      console.error("Convex user ID not found");
      return;
    }

    const msg = { role: "user", content: input };
    setMessages(msg);

    const workspaceId = await createWorkspace({
      messages: [msg],
      user: UserDetails._id,
    });

    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div className="relative min-h-screen px-6 md:px-20 pt-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      {/* Left Section */}
      <div className="flex flex-col gap-8 z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-glow text-white">
            What do you want to <span className="text-blue-500">build</span>?
          </h1>
          <p className="text-gray-400 text-base mt-2">
            Prompt, run, edit and deploy full-stack web apps with one command.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white transition duration-200"
              onClick={() => generate(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* User Input */}
        <div className="bg-[#111] border border-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 p-5">
          <div className="flex gap-3 items-start">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="bg-transparent w-full h-24 text-white placeholder:text-gray-500 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition"
              placeholder="Describe what you want to build..."
            />
            {userInput && (
              <ArrowRight
                onClick={() => generate(userInput)}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 p-2 rounded-lg cursor-pointer transition"
              />
            )}
          </div>
          <div className="mt-2 text-gray-600 flex justify-end">
            <Link className="h-4 w-4" />
          </div>
        </div>

        <Signin OpenDialog={openDialog} CloseDialog={() => setOpenDialog(false)} />
      </div>

      {/* Spline 3D Element */}
      <Spline
        scene="https://prod.spline.design/GBMiFic7a8H0PAkN/scene.splinecode"
        className="fixed bottom-0 pb-[50rem] left-[28rem] w-[280px] h-[50px] md:w-[400px] md:h-[200px] z-0"
      />

      <style jsx>{`
        .drop-shadow-glow {
          text-shadow:
            0 0 10px rgba(59, 130, 246, 0.6),
            0 0 20px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Hero;
