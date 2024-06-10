const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmailreminderNotification = async (recipientEmail, subject, text,medicationId ) => {


  const emailTemplate = `
   <p>${text}</p>
     <a href="http://localhost:3001/markasdone/${medicationId}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #3385ff; text-decoration: none; border-radius: 5px;">Mark as Done</a>
   `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_MAIL, 
        pass: process.env.SENDER_PASS
      },
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL, 
      to: recipientEmail,
      subject: subject,
      text: text,
      html: emailTemplate,
      
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

module.exports = { sendEmailreminderNotification };
