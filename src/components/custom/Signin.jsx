"use client";

import { useContext, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Context } from "@/context/Context";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import uuid4 from "uuid4";

const SignIn = ({ OpenDialog, CloseDialog }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { UserDetails, setUserDetails } = useContext(Context);
  const createUser = useMutation(api.users.userController);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer" + tokenResponse.access_token } }
      );
      const user = userInfo.data;
      console.log(userInfo.data);
      createUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        uid: uuid4(),
      });
      window.localStorage.setItem("user", JSON.stringify(user));
      setUserDetails(userInfo?.data);
      CloseDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={OpenDialog} onOpenChange={CloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center font-bold text-3xl">
            Continue With ThunderBolt
          </DialogTitle>
          <DialogTitle className="flex justify-center items-center font-normal text-[14px]">
            To use ThunderBolt you must log into an existing account or create
            one
          </DialogTitle>
        </DialogHeader>

        <Button onClick={googleLogin} className="w-full mt-2">
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignIn;
