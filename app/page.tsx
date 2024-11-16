"use client";
import { NavigationLayout } from "@/components/NavigationLayout";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { SignMessageBlock } from "@/components/SignMessage";
import { SendTransBlock } from "@/components/SendTrans";
import { useState } from "react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState("home");

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <SignIn />;
      case "verify":
        return <VerifyBlock />;
      case "pay":
        return <PayBlock />;
      case "sign":
        return <SignMessageBlock />;
      case "send":
        return <SendTransBlock />;
      default:
        return <SignIn />;
    }
  };

  return (
    <NavigationLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
        {renderContent()}
      </div>
    </NavigationLayout>
  );
}
