import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { sendEmail } from '../utils/mailer';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/send-otp
// @desc    Send OTP for user signup
// @access  Public
router.post('/send-otp', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required fields.' });
  }

  try {
    let user: IUser | null = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists. Please log in.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user = new User({
      name,
      email,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });
    
    await user.save();

    const mailOptions = {
      from: `Notes App <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your One-Time Password (OTP) for Notes App',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Notes App!</h2>
          <p>Thank you for starting the registration process. Please use the following One-Time Password to complete your signup:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
          <p>This OTP is valid for the next 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await sendEmail(mailOptions);
    res.status(200).json({ message: 'OTP has been sent to your email. Please verify to continue.' });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
});

// @route   POST /api/auth/signup
// @desc    Verify OTP and register user
// @access  Public
router.post('/signup', async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({ message: 'Invalid request. Please sign up first.' });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    
    const jwtSecret = process.env.JWT_SECRET || 'a-default-secret-key';

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '3d' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, user: payload.user });
      }
    );

  } catch (error) {
    console.error('Server Error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ 
        message: 'An unexpected server error occurred.',
        error: error.message
      });
    }
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate user with Google
// @access  Public
router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId: sub,
        name: name,
        email: email,
      });
      await user.save();
    }

    const jwtPayload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    const jwtSecret = process.env.JWT_SECRET || 'a-default-secret-key';
    jwt.sign(jwtPayload, jwtSecret, { expiresIn: '3d' }, (err, jwtToken) => {
      if (err) throw err;
      res.status(200).json({ token: jwtToken, user: jwtPayload.user });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Google authentication failed.' });
  }
});

// @route   POST /api/auth/login/send-otp
// @desc    Send OTP for an existing user to log in
// @access  Public
router.post('/login/send-otp', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email not found. Please sign up.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    await user.save();

    const mailOptions = {
      from: `Notes App <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Login OTP for Notes App',
      html: `<p>Your One-Time Password for login is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    };

    await sendEmail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully to your email.' });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
});

// @route   POST /api/auth/login/verify-otp
// @desc    Verify OTP and log in user
// @access  Public
router.post('/login/verify-otp', async (req: Request, res: Response) => {
  // --- UPDATED ---
  const { email, otp, keepLoggedIn } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid request or OTP not requested.' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const payload = {
      user: { id: user.id, name: user.name, email: user.email },
    };

    const jwtSecret = process.env.JWT_SECRET || 'a-default-secret-key';
    
    // --- UPDATED ---
    const expiresIn = keepLoggedIn ? '30d' : '1d';

    jwt.sign(payload, jwtSecret, { expiresIn: expiresIn }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token, user: payload.user });
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
});


export default router;