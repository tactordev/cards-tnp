

import * as ably from 'ably';

export async function GET() {
    if (!process.env.API_KEY) {
        return new Response("API key not set in the environment file.", { status: 500 });
    }

    const client = new ably.Rest(process.env.API_KEY);

    const token = await client.auth.createTokenRequest({
        clientId: `client-${Math.random().toString(36).substring(2, 9)}`
    });

    return Response.json(token);
}