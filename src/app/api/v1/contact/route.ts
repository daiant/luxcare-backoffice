import { mailer } from '@/lib/mail';
import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.token) return new Response(JSON.stringify({ error: "no token" }), { status: 400 });
  const tokenResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${body.token}`, { method: "POST" })
  const { score } = await tokenResponse.json()
  if (score < 0.5) return new Response(JSON.stringify({ error: "Are you a bot?" }), { status: 401 });

  await sql`INSERT INTO customer_contacts (name, email, phone, comments) VALUES (${body.name}, ${body.email}, ${body.phone}, ${body.question});`;

  mailer.sendMail({
    from: 'web@luxcare.es',
    to: 'cmg2512@gmail.com',
    subject: 'Nuevo Contacto Luxcare',
    html: `
    <h1>Alguien ha solicitado contactar en Luxcare</h1>
    ${body.name ? ` <h2>Nombre</h2> <p>${body.name}</p> <br/> ` : ``}
    ${body.email ? ` <h2>Email</h2> <p>${body.email}</p> <br/> ` : ``}
    ${body.phone ? ` <h2>Teléfono</h2> <p>${body.phone}</p> <br/> ` : ``}
    ${body.question ? ` <h2>Asunto</h2> <p>${body.question}</p> <br/> ` : ``}
    `
  });

  return new Response(JSON.stringify({ msg: 'todo bien' }));
}