"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
  ResponseEvent,
  MiniAppPaymentPayload,
} from "@worldcoin/minikit-js";
import { useEffect } from "react";
// ...
const sendPayment = async () => {
  const res = await fetch("/api/initiate-payment", {
    method: "POST",
  });

  const { id } = await res.json();

  console.log(id);

  const payload: PayCommandInput = {
    reference: id,
    to: "0xeb0096d38287397f24fb3acbf4b42432519d55c6", // Test address
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(0.05, Tokens.WLD).toString(),
      },
    ],
    description: "Watch this is a test",
  };

  if (MiniKit.isInstalled()) {
    MiniKit.commands.pay(payload);
  }
};

export const PayBlock = () => {
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppPayment,
      async (response: MiniAppPaymentPayload) => {
        if (response.status == "success") {
          const res = await fetch(`/api/confirm-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload: response }),
          });
          const payment = await res.json();
          if (payment.success) {
            // Congrats your payment was successful!
            console.log("SUCESS!");
          } else {
            // Payment failed
            console.log("FAILED!");
          }
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Make Payment</h1>
      <button
        className="w-full bg-blue-500 text-white p-4 rounded-lg"
        onClick={sendPayment}
      >
        Pay 0.05 WLD
      </button>
    </div>
  );
};
