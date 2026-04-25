const nodemailer = require('nodemailer');

// Set this up with .env variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: (process.env.EMAIL_SECURE === 'true'),
  auth: process.env.EMAIL_USER
    ? {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
    : undefined,
});

const fromAddress = process.env.EMAIL_FROM || '"C2C Admin" <noreply@c2c.com>';

const serverBase = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8080}`;
const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000/MarketPlace';

async function sendMailSafe(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    // If sending fails, log error and rethrow so caller can decide
    console.error('Email send failed:', err);
    throw err;
  }
}

exports.sendVerificationEmail = async (toEmail, token) => {
  const verificationLink = `${frontendBase}/verify-email?token=${token}`;

  const mail = {
    from: fromAddress,
    to: toEmail,
    subject: 'Verify your C2C Account',
    html: `<p>Please click here to verify your account:</p>
           <p><a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  return await sendMailSafe(mail);
};

exports.sendPasswordResetEmail = async (toEmail, token) => {
  const resetLink = `${frontendBase}/reset-password?token=${token}`; // Frontend route to handle reset

  const mail = {
    from: fromAddress,
    to: toEmail,
    subject: 'Reset your C2C Account password',
    html: `<p>Please click here to reset your password:</p>
           <p><a href="${resetLink}">${resetLink}</a></p>`,
  };

  return await sendMailSafe(mail);
};