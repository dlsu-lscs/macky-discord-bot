const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your email password,
  },
});

// Service to send email with the API key
async function sendEmail(recipientEmail, link) {
  try {
    let info = await transporter.sendMail({
      from: `"LSCS Discord Verification" <${process.env.SMTP_USER}>`, // sender address
      to: recipientEmail, // receiver's email
      subject: '[LSCS] Verify your Discord account', // Subject line
      html: getEmailHTML(link), // plain text body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const getEmailHTML = (link) => {
  return `<div style="font-family: Poppins, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: left; padding-bottom: 20px;">
            <h2>Email Verification</h2>
        </div>
        <p>Thank you for joining La Salle Computer Society! Please verify your discord account by clicking the button below:</p>
        <p>
            <a href="${link}" style="display: inline-block; background-color: #002D57; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </p>
        <p>If the button above does not work, please copy and paste the following link into your browser:</p>
        <p>
            <a href="${link}" style="display: block; margin-top: 15px; text-align: center; text-decoration: none; color: #555;">${link}</a>
        </p>
        <p>If you did not make this request, please ignore it and report to lscs@dlsu.edu.ph.</p>
    </div>
</div>`
}

module.exports = { sendEmail }
