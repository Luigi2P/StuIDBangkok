"use client";
import React, { ReactNode } from "react";

interface NavigationLayoutProps {
  children: ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const NavigationLayout = ({
  children,
  currentTab,
  setCurrentTab,
}: NavigationLayoutProps) => {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "verify", label: "Verify" },
    { id: "pay", label: "Pay" },
    { id: "sign", label: "Sign" },
    { id: "send", label: "Send" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                currentTab === id
                  ? "text-blue-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
