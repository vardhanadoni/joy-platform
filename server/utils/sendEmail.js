// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using your email service's SMTP details
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // If you're having issues, you can add tls configuration
    // tls: {
    //   rejectUnauthorized: false
    // }
  });

  // 2. Define email options
  const mailOptions = {
    from: `Diabetic Retinopathy App <${process.env.EMAIL_USER}>`, // Sender address
    to: options.to,          // List of receivers
    subject: options.subject,// Subject line
    html: options.html,      // HTML body
    text: options.text,      // Plain text body (for clients that don't support HTML)
    attachments: options.attachments || [] // Array of attachments, if any
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // For testing with ethereal.email
    return true; // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Email failed to send
  }
};

module.exports = sendEmail;