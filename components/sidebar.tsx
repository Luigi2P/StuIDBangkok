// components/Sidebar.js
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHome, FiList, FiUser, FiMenu } from 'react-icons/fi';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={toggleMobileMenu}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-40 h-full bg-gray-800 text-white transition-transform duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h1 className="text-lg font-bold">My App</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block focus:outline-none"
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
              <Link 
                href="/" 
                className="flex items-center px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiHome size={20} />
                {!isCollapsed && <span className="ml-2">Main</span>}
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                href="/TaskList" 
                className="flex items-center px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiList size={20} />
                {!isCollapsed && <span className="ml-2">Task List</span>}
              </Link>
            </li>
            <li className="mb-4">
              <Link 
                href="/MyTask" 
                className="flex items-center px-4 py-2 hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiUser size={20} />
                {!isCollapsed && <span className="ml-2">My Task</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
