import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.token) return new Response(JSON.stringify({ error: "no token" }), { status: 400 });
  const tokenResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${body.token}`, { method: "POST" })
  const { score } = await tokenResponse.json()
  if (score < 0.5) return new Response(JSON.stringify({ error: "Are you a bot?" }), { status: 401 });

  await sql`INSERT INTO customer_contacts (name, email, phone, comments) VALUES (${body.name}, ${body.email}, ${body.phone}, ${body.question});`;

  return new Response(JSON.stringify({ msg: 'todo bien' }));
}