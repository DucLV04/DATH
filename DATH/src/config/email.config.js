const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a reusable transporter object using the SMTP transport
// We pull the connection details from the .env file
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.mailtrap.io' or 'smtp.gmail.com'
  port: parseInt(process.env.EMAIL_PORT) || 587, // 587 for TLS, 465 for SSL
  secure: false, // true for 465, false for other ports (like 587 with STARTTLS)
  auth: {
    user: process.env.EMAIL_USER, // Your email service username
    pass: process.env.EMAIL_PASS, // Your email service password
  },
});

module.exports = transporter;