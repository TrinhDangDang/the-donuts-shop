import nodemailer from "nodemailer";

// Create the transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., 'youremail@gmail.com')
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Export the transporter
export default transporter;
