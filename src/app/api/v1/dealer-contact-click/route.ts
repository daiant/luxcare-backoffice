import { sql } from '@vercel/postgres';

enum DealerEventType {
  ClickEvent
}
export async function POST(req: Request) {
  const body = await req.json()
  if (!body.token) return new Response(JSON.stringify({ error: "no token" }), { status: 400 });
  if (!body.dealer) return new Response(JSON.stringify({ error: 'no dealer' }), { status: 400 });

  const tokenResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${body.token}`, { method: "POST" })
  const { score } = await tokenResponse.json()
  if (score < 0.5) return new Response(JSON.stringify({ error: "Are you a bot?" }), { status: 401 });
  await sql`INSERT INTO dealer_click_events (dealer, event_type, additional_info) VALUES (${body.dealer}, ${DealerEventType.ClickEvent}, ${body.customer_location});`;

  return new Response(JSON.stringify({ msg: body }));
}