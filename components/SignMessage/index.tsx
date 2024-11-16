"use client";
import { MiniKit, SignMessageInput, ResponseEvent, MiniAppSignMessagePayload } from '@worldcoin/minikit-js'
import { useEffect, useState } from "react";
import Safe, { hashSafeMessage } from "@safe-global/protocol-kit";


export const SignMessageBlock = () => {
    const [message, setMessage] = useState("Hello world");

    const onSignMessage = () => {
        if (!MiniKit.isInstalled()) {
            return;
        }
        const signMessagePayload: SignMessageInput = {
            message: message,
        };

        MiniKit.commands.signMessage(signMessagePayload);
    };

    useEffect(() => {
        if (!MiniKit.isInstalled()) {
            console.error("MiniKit is not installed");
            return;
        }

        MiniKit.subscribe(ResponseEvent.MiniAppSignMessage, async (payload: MiniAppSignMessagePayload) => {

            const messageHash = hashSafeMessage(message);

            const isValid = await (
                await Safe.init({
                    provider:
                        "https://worldchain-mainnet.g.alchemy.com/v2/8ig1zXEb-Y5Ltb6gGKQcmjcUZwUkmiPA",
                    safeAddress: payload.address,
                })
            ).isValidSignature(messageHash, payload.signature);

            // Checks functionally if the signature is correct
            if (isValid) {
                console.log("Signature is valid");
            } else {
                console.log("Signature is invalid");
            }
        });

        return () => {
            MiniKit.unsubscribe(ResponseEvent.MiniAppSignMessage);
        };
    }, [message]); // Add message to dependency array

    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border border-gray-300 rounded"
                placeholder="Enter message to sign"
            />
            <button className="bg-blue-500 p-4 text-white rounded" onClick={onSignMessage}>
                Sign Message
            </button>
        </div>
    );
};

