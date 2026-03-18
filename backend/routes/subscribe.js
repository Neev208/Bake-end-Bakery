import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const router = express.Router();

// Access the Subscriber model (ensure it's registered in server.js)
const Subscriber = mongoose.model('Subscriber');

// --- EMAIL TRANSPORTER CONFIG ---
// This uses your credentials from the .env file
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @route   POST /api/subscribe
 * @desc    Subscribe to the newsletter and send a welcome email
 */
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // 1. Create and save the new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // 2. Prepare the Welcome Email with the FRESHBAKE10 coupon
    const mailOptions = {
      from: `"Bake-end Bakery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to the Bake-end Family! 🍰',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4A3728; margin: 0; font-style: italic;">Bake-end Bakery</h1>
          </div>
          <p>Thanks for joining our <strong>"Secret Ingredient"</strong> club!</p>
          <div style="background-color: #FFFDF5; border: 1px dashed #C2A382; padding: 25px; text-align: center; border-radius: 12px;">
            <p style="color: #4A3728;">Your Welcome Gift Code: <strong style="color: #C2A382;">FRESHBAKE10</strong></p>
          </div>
          <p style="font-size: 12px; color: #5F5248; text-align: center; margin-top: 20px;">
            Handcrafted with love in Anand, Gujarat.
          </p>
        </div>
      `,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Successfully subscribed and welcome email sent!' });
  } catch (err) {
    // Handle duplicate email error (MongoDB code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists!' });
    }
    console.error('Subscription Route Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;