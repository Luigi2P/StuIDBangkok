"use client";

import { MiniKit, ResponseEvent, MiniAppSendTransactionPayload } from "@worldcoin/minikit-js";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from 'viem'
import { worldchain } from 'viem/chains'
import { useEffect, useState } from "react";

const sendTransactionCommand = async () => {
    // const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()

    // // Transfers can also be at most 1 hour in the future.
    // const permitTransfer = {
    //     permitted: {
    //         token: "ScoinToken",
    //         amount: '1',
    //     },
    //     nonce: Date.now().toString(),
    //     deadline,
    // }

    // const permitTransferArgsForm = [
    //     [permitTransfer.permitted.token, permitTransfer.permitted.amount],
    //     permitTransfer.nonce,
    //     permitTransfer.deadline,
    // ]

    // const transferDetails = {
    //     to: '0x126f7998Eb44Dd2d097A8AB2eBcb28dEA1646AC8',
    //     requestedAmount: '1',
    // }

    // const transferDetailsArgsForm = [transferDetails.to, transferDetails.requestedAmount]

    const payload = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
            {
                address: '0x74acA102a5968D2CA320E6aa091b670D90c70Ac0',
                abi: [
                    {
                      "inputs": [
                        {
                          "internalType": "int256",
                          "name": "_initialInt",
                          "type": "int256"
                        }
                      ],
                      "stateMutability": "nonpayable",
                      "type": "constructor"
                    },
                    {
                      "inputs": [],
                      "name": "getInt",
                      "outputs": [
                        {
                          "internalType": "int256",
                          "name": "",
                          "type": "int256"
                        }
                      ],
                      "stateMutability": "view",
                      "type": "function"
                    },
                    {
                      "inputs": [],
                      "name": "storedInt",
                      "outputs": [
                        {
                          "internalType": "int256",
                          "name": "",
                          "type": "int256"
                        }
                      ],
                      "stateMutability": "view",
                      "type": "function"
                    }
                  ],
                functionName: 'getInt',
                args: [],
            },
        ]
        // permit2: [
        //     {
        //         ...permitTransfer,
        //         spender: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
        //     },
        // ],
        
    })
    console.log(payload)
}

export const SendTransBlock = () => {

    const [transactionId, setTransactionId] = useState<string>('')
    const client = createPublicClient({
        chain: worldchain,
        transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
    }) as any
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        client: client,
        appConfig: {
          app_id: 'app_f2c54730bd29866f2e26ff0799a56a82',
        },
        transactionId: transactionId,
      })
      
    useEffect(() => {
        if (!MiniKit.isInstalled()) {
          return
        }
      
        MiniKit.subscribe(ResponseEvent.MiniAppSendTransaction, async (payload: MiniAppSendTransactionPayload) => {
          if (payload.status === 'error') {
            console.error('Error sending transaction', payload)
          } else {
            setTransactionId(payload.transaction_id)
          }
        })
      
        return () => {
          MiniKit.unsubscribe(ResponseEvent.MiniAppSendTransaction)
        }
      }, [])

      return (
        <button className="bg-blue-500 p-4" onClick={sendTransactionCommand}>
          SendTrans
        </button>
      );
};
