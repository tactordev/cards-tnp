

import * as ably from 'ably';

export async function GET() {
    if (!process.env.ROOT_KEY) {
        return new Response("Root key not set in the environment file.", { status: 500 });
    }

    const client = new ably.Rest(process.env.ROOT_KEY);

    const token = await client.auth.createTokenRequest({
        clientId: `client-${Math.random().toString(36).substring(2, 9)}`
    });

    return new Response(JSON.stringify(token), { status: 200, headers: { 'Content-Type': 'application/json' } });
}