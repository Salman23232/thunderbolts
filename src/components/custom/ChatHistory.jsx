'use client'
import { Context } from '@/context/Context'
import React, { useContext, useState, useEffect } from 'react'
import { api } from '../../../convex/_generated/api';
import { useConvex } from 'convex/react';
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';

const ChatHistory = () => {
  const { UserDetails } = useContext(Context);
  const [workspaceList, setWorkspaceList] = useState([]);
  const convex = useConvex();
  const { toggleSidebar } = useSidebar();

  const GetAllWorkSpace = async () => {
    try {
      const result = await convex.query(api.workspace.getAllWorkSpace, {
        userId: UserDetails?._id,
      });
      setWorkspaceList(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (UserDetails) {
      GetAllWorkSpace();
    }
  }, [UserDetails]);

  return (
    <div className="mt-4 w-full">
      <h2 className="font-semibold text-base text-white mb-3">Your Chats</h2>
      <div className="space-y-2">
        {workspaceList.map((workspace, index) => (
          <Link key={index} href={`/workspace/${workspace?._id}`} passHref>
            <div
              onClick={toggleSidebar}
              className="text-sm text-gray-400 hover:text-white hover:shadow-[0_0_8px_white] w-full rounded-md transition-all duration-200 cursor-pointer truncate overflow-hidden whitespace-nowrap px-2 py-1"
              title={workspace.messages[0]?.content || 'No messages'} // Optional: Show full text on hover
            >
              {workspace.messages[0]?.content || 'No messages'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
