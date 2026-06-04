"use client";
import * as ably from 'ably';
import { AblyProvider, ChannelProvider } from "ably/react";


export default function Game() {
    const client = new ably.Realtime({
        authUrl: "/api/auth"
    });


    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName="settings">
            
            </ChannelProvider>
        </AblyProvider>
    )
}