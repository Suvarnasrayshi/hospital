const nodemailer = require('nodemailer');

const sendEmailNotification = async (recipientEmail, subject, text, attachment = null) => {
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
      attachments: attachment ? [{ path: attachment }] : [], 
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

module.exports = { sendEmailNotification };
