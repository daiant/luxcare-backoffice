import { mailer } from '@/lib/mail';
import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  const body = await req.json()
  if (!body.token) return new Response(JSON.stringify({ error: "no token" }), { status: 400 });
  const tokenResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA}&response=${body.token}`, { method: "POST" })
  const { score } = await tokenResponse.json()
  if (score < 0.5) return new Response(JSON.stringify({ error: "Are you a bot?" }), { status: 401 });

  await sql`INSERT INTO customer_contacts (name, email, phone, comments) VALUES (${body.name}, ${body.email}, ${body.phone}, ${body.question});`;

  console.log('Sending contact mail...');
  const result = await mailer.sendMail({
    from: 'web@luxcare.es',
    to: 'cmg2512@gmail.com',
    subject: 'Nuevo Contacto Luxcare',
    html: `
    <h1>Alguien ha solicitado contactar en Luxcare</h1>
    ${body.name ? ` <p style="font-size: 22px;">Nombre</p> <p>${body.name}</p> <br/> ` : ``}
    ${body.email ? ` <p style="font-size: 22px;">Email</p> <p>${body.email}</p> <br/> ` : ``}
    ${body.phone ? ` <p style="font-size: 22px;">Teléfono</p> <p>${body.phone}</p> <br/> ` : ``}
    ${body.question ? ` <p style="font-size: 22px;">Asunto</p> <p>${body.question}</p> <br/> ` : ``}
    `
  });
  return new Response(JSON.stringify({ msg: 'todo bien' }));
}