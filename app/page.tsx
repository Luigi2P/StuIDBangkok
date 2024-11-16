// pages/index.js
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { SignMessageBlock } from "@/components/SignMessage";
import { SendTransBlock } from "@/components/SendTrans";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4">
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
      </div>
    </Layout>
  );
}
