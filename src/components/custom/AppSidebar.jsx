

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import { Button } from "../ui/button";
import ChatHistory from "./ChatHistory";
import SideBarFooter from "./SideBarFooter";
import { MessageCircleCode } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar className="h-screen flex flex-col bg-black shadow-[0_0_15px_white] z-20">
      <SidebarContent className="flex-1 overflow-y-auto px-4 py-6 bg-black">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={70}
            height={70}
            className="rounded-md shadow-md"
          />
        </div>

        <div className="px-2 mb-6">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition flex items-center gap-2">
            <MessageCircleCode size={18} />
            Start New Chat
          </Button>
        </div>

        <SidebarGroup className="bg-black">
          <ChatHistory />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-black shadow-[0_0_15px_white] px-4 py-4 border-t border-white/10">
        <SideBarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}


