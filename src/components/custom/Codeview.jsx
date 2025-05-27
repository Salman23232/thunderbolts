"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { Context } from "@/context/Context";
import axios from "axios";
import Prompt from "@/data/Prompt";
import Lookup from "@/data/Lookup";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
// import { countToken } from "./Chatview";
import CodePreviewComponent from "./CodePreviewComponent";

const Codeview = () => {
  const { id } = useParams();
  const convex = useConvex();

  const [activeTab, setActiveTab] = useState("code");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(Lookup.DEMO.defaultFiles);

  const { Messages, setMessages, UserDetails } = useContext(Context);
  // const updateTokens = useMutation(api.users.UpdateToken);
  const updateFiles = useMutation(api.workspace.updateAiChatWorkSpace);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.getWorkSpace, {
        workspaceId: id,
      });
      const mergedFiles = { ...Lookup.DEMO.defaultFiles, ...result?.fileData };
      setFiles(mergedFiles);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Messages.length && Messages[Messages.length - 1].role === "user") {
      GenerateAiCode();
    }
  }, [Messages]);

  const GenerateAiCode = async () => {
  setLoading(true);
  const prompt = Messages[Messages.length - 1]?.content + Prompt.GEN_AI_CODE;
  const response = await fetch("/api/ai-code", {
    method: "POST",
    body: JSON.stringify({ prompt }),
    headers: { "Content-Type": "application/json" },
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullText = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;

    // Optionally: Update the UI with streamed data (line by line)
    console.log("New chunk:", chunk);
    // Update Sandpack editor or textarea here live
  }

  try {
    const parsed = JSON.parse(fullText); // optional: wrap in try/catch if response is JSON
    const mergedFiles = {
      ...Lookup.DEMO.defaultFiles,
      ...parsed.files,
    };
    await updateFiles({ workspaceId: id, files: parsed.files });
    setFiles(mergedFiles);
  } catch {
    console.log("Partial streamed text:", fullText);
  }

  setLoading(false);
};


  return (
    <div className="relative mt-16 p-4">
      {/* Tabs */}
      <div className="bg-[#181818] w-full p-2 rounded-lg shadow-blue-glow">
        <div className="bg-black rounded-full p-1 gap-2 flex items-center w-fit px-2">
          {["code", "preview"].map((tab) => (
            <h2
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm cursor-pointer px-3 py-1 rounded-full transition-all duration-200 ${
                activeTab === tab
                  ? "text-blue-500 bg-blue-500/20 shadow-tab-glow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h2>
          ))}
        </div>
      </div>

      {/* Sandpack Code Editor + Preview */}
      <div className="mt-4 rounded-xl overflow-hidden border border-blue-500 shadow-xl shadow-blue-500/20">
        <SandpackProvider
          template="react"
          theme="dark"
          files={files}
          customSetup={{
            dependencies: {
              ...Lookup.DEMO.DEPENDENCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com/"],
          }}
        >
          <SandpackLayout>
            <SandpackFileExplorer style={{ height: "73vh" }} />
            {activeTab === "code" ? (
              <SandpackCodeEditor style={{ height: "73vh" }} />
            ) : (
              <>
              <CodePreviewComponent/>
              </>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 rounded-xl">
          <ClipLoader color="#3b82f6" loading={loading} size={30} />
          <span className="ml-3 text-blue-300 font-medium text-sm drop-shadow-glow">
            Generating Response...
          </span>
        </div>
      )}

      {/* Glow styles */}
      <style jsx>{`
        .drop-shadow-glow {
          text-shadow: 0 0 8px rgba(59, 130, 246, 0.8),
            0 0 14px rgba(59, 130, 246, 0.5);
        }
        .shadow-blue-glow {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4),
            0 0 20px rgba(59, 130, 246, 0.3);
        }
        .shadow-tab-glow {
          box-shadow: 0 0 6px rgba(59, 130, 246, 0.6),
            0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Codeview;
