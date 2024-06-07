const nodemailer = require('nodemailer');

const sendEmailreminderNotification = async (recipientEmail, subject, text,medicationId ) => {


  const emailTemplate = `
   <p>${text}</p>
     <a href="http://localhost:3001/markasdone/${medicationId}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;">Mark as Done</a>
   `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'suvarnasinha1502@gmail.com', 
        pass: 'edkz pqcu yxsc wtij', 
      },
    });

    const mailOptions = {
      from: 'suvarnasinha1502@gmail.com', 
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
