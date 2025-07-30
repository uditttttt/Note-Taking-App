import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Adding a timeout to handle potential network issues
  connectionTimeout: 10000, // 10 seconds
});

// Define an interface for our mail options for type safety
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Function to send an email
export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // In a real app, you'd want more robust error handling here
    throw new Error('Could not send email.');
  }
};