"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Context } from "@/context/Context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { useRouter } from "next/navigation";

const Provider = ({ children, ...props }) => {
  const convex = useConvex();

  const [Messages, setMessages] = useState([{ role: "", content: "" }]);
  const [UserDetails, setUserDetails] = useState(null);
  const router = useRouter()
  const [action, setAction] = useState('')

  useEffect(() => {
    // Check if the code is running on the client side
    if (typeof window === 'undefined') return;
  
    const isAuthenticated = async () => {
      try {
        const userData = window.localStorage.getItem("user");

        
        
        const user = JSON.parse(userData);
        
        if (!user?.email) {
          
          router.push('/')
          
          return};
  
        const result = await convex.query(api.users.getController, {
          email: user.email,
        });
  
        console.log("Convex user:", result);
        setUserDetails(result); // Expected to have _id, email, etc.
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };
  
    isAuthenticated();
  }, [router]);
  

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
    >
        <Context.Provider
          value={{
            Messages,
            setMessages,
            UserDetails,
            setUserDetails,
            action, setAction
          }}
        >
          <NextThemesProvider {...props}>
            <SidebarProvider defaultOpen={false}>
              <AppSidebar/>
            {children}
            </SidebarProvider>
            </NextThemesProvider>
        </Context.Provider>
    </GoogleOAuthProvider>
  );
};

export default Provider;
