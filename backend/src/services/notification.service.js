// const nodemailer = require('nodemailer');
// const Twilio = require('twilio');

// const {
//   SMTP_HOST,
//   SMTP_PORT,
//   SMTP_USER,
//   SMTP_PASS,
//   SMTP_FROM,
//   TWILIO_ACCOUNT_SID,
//   TWILIO_AUTH_TOKEN,
//   TWILIO_WHATSAPP_NUMBER
// } = process.env;

// let transporter = null;
// if (SMTP_HOST) {
//   transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT) || 587,
//     secure: false,
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS
//     }
//   });
// }

// let twilioClient = null;
// if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
//   twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// }

// /**
//  * sendEmail
//  * @param {Object} opts - { to, subject, text, html }
//  */
// async function sendEmail(opts = {}) {
//   if (!transporter) {
//     console.warn('Email transporter not configured');
//     return { ok: false, error: 'Email not configured' };
//   }
//   const mailOptions = {
//     from: SMTP_FROM,
//     to: opts.to,
//     subject: opts.subject,
//     text: opts.text,
//     html: opts.html
//   };
//   const info = await transporter.sendMail(mailOptions);
//   return { ok: true, info };
// }

// /**
//  * sendWhatsApp
//  * @param {Object} opts - { toNumber (E.164), body }
//  */
// async function sendWhatsApp(opts = {}) {
//   if (!twilioClient) {
//     console.warn('Twilio not configured');
//     return { ok: false, error: 'Twilio not configured' };
//   }
//   const from = TWILIO_WHATSAPP_NUMBER;
//   const to = opts.toNumber.startsWith('whatsapp:') ? opts.toNumber : `whatsapp:${opts.toNumber}`;
//   const message = await twilioClient.messages.create({
//     from,
//     to,
//     body: opts.body
//   });
//   return { ok: true, messageSid: message.sid };
// }

// module.exports = {
//   sendEmail,
//   sendWhatsApp
// };



// src/services/notification.service.js
// Temporary notification service without Twilio/Email

export async function sendWhatsApp(to, message) {
  console.log(`[Mock WhatsApp] To: ${to} | Message: ${message}`);
  return { success: true };
}

export async function sendEmail(to, subject, message) {
  console.log(`[Mock Email] To: ${to} | Subject: ${subject} | Message: ${message}`);
  return { success: true };
}

// Generic notify function
export async function notifyUser(user, type, payload) {
  console.log(`[Mock Notification] User: ${user.email || user.id} | Type: ${type}`, payload);
  return { success: true };
}
