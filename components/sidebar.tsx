// components/Sidebar.js
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHome, FiList, FiUser } from 'react-icons/fi';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen bg-gray-800 text-white ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-lg font-bold">My App</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="focus:outline-none"
        >
          {isCollapsed ? (
            <FiChevronRight size={24} />
          ) : (
            <FiChevronLeft size={24} />
          )}
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="mt-4">
          <li className="mb-4">
            <Link href="/" className="flex items-center px-4 py-2 hover:bg-gray-700">
              <FiHome size={20} />
              {!isCollapsed && <span className="ml-2">Main</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/TaskList" className="flex items-center px-4 py-2 hover:bg-gray-700">
              <FiList size={20} />
              {!isCollapsed && <span className="ml-2">Task List</span>}
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/MyTask" className="flex items-center px-4 py-2 hover:bg-gray-700">
              <FiUser size={20} />
              {!isCollapsed && <span className="ml-2">My Task</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
