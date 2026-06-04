


export async function GET() {
    return new Response(JSON.stringify({msg: "Erm, nothing here"}), { status: 200, headers: { 'Content-Type': 'application/json' } });
}