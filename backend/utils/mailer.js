import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// ✅ SCHEMA SAFETY: Check if the model exists before defining it
// This prevents "OverwriteModelError" when Vercel reloads the function
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

// ✅ AUTHENTICATION CHECK
// If these are missing on Vercel, the app will warn you instead of crashing
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ Mailer Warning: EMAIL_USER or EMAIL_PASS not found in environment variables.");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be your 16-character App Password
  }
});

/**
 * Sends an aesthetic notification to all subscribers when a new product is added.
 */
export const notifySubscribersNewItem = async (productData) => {
  try {
    // 1. Fetch all subscriber emails
    const subscribers = await Subscriber.find({}, 'email');
    
    // 2. If no subscribers, just log and exit
    if (!subscribers || subscribers.length === 0) {
      console.log("ℹ️ No subscribers found to notify.");
      return;
    }

    const emailList = subscribers.map(sub => sub.email);
    
    // 3. Craft the Aesthetic HTML Template
    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF5; border: 1px solid #C2A382; padding: 40px; text-align: center; color: #4A3728;">
        <h1 style="margin-bottom: 10px; font-style: italic;">Bake-end Boutique</h1>
        <hr style="border: 0; border-top: 1px solid #C2A382; margin-bottom: 20px;" />
        
        <h2 style="font-weight: normal; letter-spacing: 1px;">Fresh Out of the Oven!</h2>
        <h3 style="color: #8B5E3C; font-size: 24px;">${productData.name}</h3>
        
        ${productData.img ? 
          `<div style="margin: 25px 0;">
            <img src="${productData.img}" alt="${productData.name}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
          </div>` : ''
        }
        
        <p style="font-size: 28px; color: #C2A382; font-weight: bold; margin: 10px 0;">₹${productData.price}</p>
        <p style="color: #6D4C41; font-size: 16px; line-height: 1.5;">${productData.desc || 'Handcrafted with premium ingredients and a touch of bakery magic.'}</p>
        
        <div style="margin-top: 40px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" 
             style="background-color: #4A3728; color: #FFFFFF; padding: 18px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; letter-spacing: 1px;">
             Order Online Now
          </a>
        </div>
        
        <p style="margin-top: 40px; font-size: 11px; color: #C2A382; text-transform: uppercase;">
          Freshly baked, just for you.
        </p>
      </div>
    `;

    // 4. Dispatch the Mail
    await transporter.sendMail({
      from: `"Bake-end Bakery Boutique" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sends a copy to you
      bcc: emailList,            // Keeps subscriber emails private from each other
      subject: `🥐 New Arrival: ${productData.name} is here!`,
      html: htmlContent,
    });

    console.log(`✅ Emails successfully dispatched to ${subscribers.length} subscribers.`);
  } catch (error) {
    console.error("❌ Mailer Error:", error);
  }
};

export default transporter;