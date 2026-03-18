import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Define Subscriber schema here to avoid dependency issues
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now }
});
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export const notifySubscribersNewItem = async (productData) => {
  try {
    const subscribers = await Subscriber.find({}, 'email');
    if (!subscribers || subscribers.length === 0) return;

    const emailList = subscribers.map(sub => sub.email);
    
    const htmlContent = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF5; border: 1px solid #C2A382; padding: 40px; text-align: center;">
        <h1 style="color: #4A3728; margin-bottom: 10px;">Bake-end Boutique</h1>
        <hr style="border: 0; border-top: 1px solid #C2A382; margin-bottom: 20px;" />
        <h2 style="color: #4A3728;">Fresh Out of the Oven!</h2>
        <h3 style="color: #8B5E3C;">${productData.name}</h3>
        ${productData.img ? `<img src="${productData.img}" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />` : ''}
        <p style="font-size: 26px; color: #C2A382; font-weight: bold;">$${productData.price}</p>
        <p style="color: #6D4C41;">${productData.desc || 'Handcrafted with love.'}</p>
        <div style="margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" style="background-color: #4A3728; color: #FFFFFF; padding: 15px 35px; text-decoration: none; border-radius: 5px; font-weight: bold;">Order Online Now</a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bake-end Bakery Boutique" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Admin copy
      bcc: emailList, // Send to all subscribers privately
      subject: `🥐 New Arrival: ${productData.name} is here!`,
      html: htmlContent,
    });
    console.log("✅ Emails dispatched to subscribers.");
  } catch (error) {
    console.error("❌ Mailer Error:", error);
  }
};

export default transporter;