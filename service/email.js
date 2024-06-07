const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailNotification = async (recipientEmail, subject, text, attachment = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_MAIL, 
        pass: 'edkz pqcu yxsc wtij', 
      },
    });

    const mailOptions = {
     from: process.env.SENDER_MAIL, 
      to: recipientEmail,
      subject: subject,
      text: text,
      attachments: attachment ? [{ path: attachment }] : [], 
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

module.exports = { sendEmailNotification };
