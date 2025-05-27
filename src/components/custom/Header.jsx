"use client";

import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Context } from "@/context/Context";
import { Rocket, Share } from "lucide-react";
import SignIn from "./Signin";

const Header = () => {
  const { UserDetails, action, setAction } = useContext(Context);
  const setActionFunction = (action) => {
    return setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };
    const [openDialog, setOpenDialog] = useState(false);
  

  return (
    <div className="flex justify-between items-center px-4 py-2 fixed top-0 left-0 right-0 z-10 mb-16 bg-black/90 shadow-[0_0_15px_white] backdrop-blur-sm">
      <div className="flex gap-3 items-center">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={60}
          height={60}
          className="rounded-md"
        />
        <h1 className="text-3xl font-black  text-white drop-shadow-lg">
          ThunderBolts
        </h1>
      </div>

      {!UserDetails?.name ? (
        <div className="flex gap-4">
          <Button
          onClick={()=>setOpenDialog(true)}
            variant="ghost"
            className="text-white hover:bg-white/10 transition"
          >
            Sign in
          </Button>
          <Button className="text-white bg-blue-500 hover:bg-blue-600 transition shadow-md"
          onClick={()=>setOpenDialog(true)}
          >
            Get Started
          </Button>
          <SignIn OpenDialog={openDialog} CloseDialog={() => setOpenDialog(false)} />
        </div>
      ) : (
        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setActionFunction("export");
            }}
            className="text-white hover:bg-white/10 transition flex items-center gap-1"
          >
            <Share size={16} />
            Share
          </Button>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-600 transition flex items-center gap-1 shadow-md"
            onClick={() => {
              setActionFunction("deploy");
            }}
          >
            <Rocket size={16} />
            Deploy
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
