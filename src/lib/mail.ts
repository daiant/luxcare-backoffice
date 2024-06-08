import nodemailer from 'nodemailer';
export const mailer = nodemailer.createTransport({
  host: 'mail.luxcare.es',
  port: 465,
  // secure: true,
  auth: {
    user: 'web@luxcare.es',
    pass: process.env.MAIL_PASS,
  }
});