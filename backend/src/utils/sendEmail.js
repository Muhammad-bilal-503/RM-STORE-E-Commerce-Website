const nodemailer = require('nodemailer');

/**
 * Sends an email using SMTP credentials from environment variables.
 * If EMAIL_HOST is not configured (e.g. local dev without a mail provider),
 * falls back to logging the email to the console instead of throwing,
 * so the rest of the flow (verification/reset) still works during development.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('--- EMAIL (SMTP not configured, logging instead) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html);
    console.log('-----------------------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
