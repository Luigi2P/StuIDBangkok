"use client";
import { MiniKit, SignMessageInput, ResponseEvent, MiniAppSignMessagePayload } from '@worldcoin/minikit-js'
import { useEffect } from "react";
import Safe, { hashSafeMessage } from "@safe-global/protocol-kit";

const onSignMessage = () => {
    if (!MiniKit.isInstalled()) {
        return
    }
    const signMessagePayload: SignMessageInput = {
        message: "Hello world",
    };

    MiniKit.commands.signMessage(signMessagePayload);
};

export const SignMessageBlock = () => {
    useEffect(() => {
        if (!MiniKit.isInstalled()) {
            console.error("MiniKit is not installed");
            return;
        }

        MiniKit.subscribe(ResponseEvent.MiniAppSignMessage, async (payload: MiniAppSignMessagePayload) => {
            // console check if payload exists
            if (payload) {  
                console.log(payload);
            } else {
                console.log("No payload");
            }

            if (true) {
                const messageHash = hashSafeMessage("Hello world");

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
            }
            else {
                console.log("Signature failed");
            }
        });

        return () => {
            MiniKit.unsubscribe(ResponseEvent.MiniAppSignMessage);
        };
    }, []);

    return (
        <button className="bg-blue-500 p-4" onClick={onSignMessage}>
            Sign Message
        </button>
    );
};

