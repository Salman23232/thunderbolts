"use client"

import { Ghost, HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../ui/sidebar";




const SideBarFooter = () => {
    const router = useRouter()
    const {toggleSidebar} = useSidebar()
    const SidebarItem = [
        { menu: "Settings", icon: Settings },
        { menu: "My Subscription", icon: Wallet ,path:'/pricing'},
        { menu: "Help Center", icon: HelpCircle },
        { menu: "Logout", icon: LogOut }, // Also fixed duplicate "Settings"
      ];
    const sidebarOnClick = (option) => {
        router.push(option.path)
        toggleSidebar()
    }
  return (
    <div className="p-2 mt-10 bg-black">
      {SidebarItem.map((item, index) => {
        return (
          <Button
            variant="ghost"
            onClick={()=>sidebarOnClick(item)}
            key={index}
            className="w-full flex justify-start gap-2 bg-black"
          >
            <item.icon />
            {item.menu}
          </Button>
        );
      })}
    </div>
  );
};

export default SideBarFooter;
