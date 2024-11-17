"use client";
import { MiniKit, SignMessageInput, ResponseEvent, MiniAppSignMessagePayload } from '@worldcoin/minikit-js'
import { useEffect, useState } from "react";
import Safe, { hashSafeMessage } from "@safe-global/protocol-kit";
import { QRCodeSVG } from 'qrcode.react';

export const SignMessageBlock = () => {
    const [message, setMessage] = useState("Hello world");
    const [qrData, setQrData] = useState<string>("");

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

            if (isValid) {
                console.log("Signature is valid");
                const qrString = [
                    `Address: ${payload.address}`,
                    `Signature: ${payload.signature}`,
                    `Message Hash: ${messageHash}`
                ].join('\n');
                setQrData(qrString);
            } else {
                console.log("Signature is invalid");
            }
        });

        return () => {
            MiniKit.unsubscribe(ResponseEvent.MiniAppSignMessage);
        };
    }, [message]);

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
            {qrData && (
                <div className="mt-4">
                    <QRCodeSVG value={qrData} size={256} />
                </div>
            )}
        </div>
    );
};

