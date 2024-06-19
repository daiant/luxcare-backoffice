import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.token) return new Response(JSON.stringify({ error: "no token" }), { status: 400 });
  if (!body.value?.name) return new Response(JSON.stringify({ error: 'no location name' }), { status: 400 });

  const tokenResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${body.token}`, { method: "POST" })
  const { score } = await tokenResponse.json()
  if (score < 0.5) return new Response(JSON.stringify({ error: "Are you a bot?" }), { status: 401 });
  await sql`INSERT INTO dealer_search_locations (search_string, additional_info) VALUES (${body.value?.name ?? ''}, ${body.value});`;

  return new Response(JSON.stringify({ msg: body.value }));
}