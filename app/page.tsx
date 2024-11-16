// pages/index.js
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { SignMessageBlock } from "@/components/SignMessage";
import { SendTransBlock } from "@/components/SendTrans";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-col flex-grow p-24 gap-y-3">
        <div id="sign-in">
          <SignIn />
        </div>
        <div id="verify">
          <VerifyBlock />
        </div>
        <div id="pay">
          <PayBlock />
        </div>
        <div id="sign-message">
          <SignMessageBlock />
        </div>
        <div id="send-transaction">
          <SendTransBlock />
        </div>
      </main>
    </div>
  );
}
