import { mailer } from '@/lib/mail';
import { NextResponse } from 'next/server';
export function GET() {
  // mailer.sendMail({
  //   from: 'web@luxcare.es',
  //   to: 'cmg2512@gmail.com',
  //   subject: 'hola holita',
  //   html: '<p>Soy un testo</p>'
  // });
  return new Response(JSON.stringify({ msg: 'todo bien' }))
}