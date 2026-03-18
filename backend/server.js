import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Route Imports
import orderroutes from './routes/orderroutes.js';
import productRoutes from './routes/productroutes.js'; 
import cartRoutes from './routes/cartroutes.js';

// Mailer Import
import transporter, { notifySubscribersNewItem } from './utils/mailer.js';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists physically
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("📁 Created 'uploads' directory");
}

// --- 1. CRITICAL MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ SERVE IMAGES AS STATIC FILES 
app.use('/uploads', express.static(uploadsPath));

// --- 2. MONGODB SCHEMAS & MODELS ---

// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  resetOtp: { type: String },
  resetOtpExpire: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// SUBSCRIBER SCHEMA
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now }
});
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

// COUPON SCHEMA
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true }
});
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

// BUY NOW SCHEMA (TEMPORARY CACHE FOR QUICK CHECKOUT)
const buyNowSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  item: {
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    selectedWeight: String,
    selectedPersonalization: String,
    img: String,
  },
  createdAt: { type: Date, default: Date.now, index: { expires: 3600 } } 
});
const BuyNow = mongoose.models.BuyNow || mongoose.model('BuyNow', buyNowSchema);

// ORDER SCHEMA (Added locally for internal route handling if needed)
const orderSchema = new mongoose.Schema({
  userId: String,
  customer: Object,
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// --- 3. SEED FUNCTION ---
const seedCoupons = async () => {
  try {
    const code = "FRESHBAKE10";
    const existing = await Coupon.findOne({ code });
    if (!existing) {
      await Coupon.create({
        code,
        discountPercentage: 10,
        isActive: true,
        expiryDate: new Date("2030-12-31") 
      });
      console.log(`✅ Coupon ${code} initialized in database.`);
    }
  } catch (err) {
    console.error("❌ Seed Error:", err);
  }
};

// --- 4. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully for Bake-end Bakery');
    seedCoupons(); 
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- 5. API ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 

// --- NEW: ORDER PLACEMENT WITH EMAIL NOTIFICATION ---
app.post('/api/orders', async (req, res) => {
  const { userId, customer, items, totalAmount, paymentMethod } = req.body;

  try {
    // 1. Save order to MongoDB
    const newOrder = new Order({
      userId,
      customer,
      items,
      totalAmount,
      paymentMethod,
      status: "Confirmed"
    });
    const savedOrder = await newOrder.save();

    // 2. Prepare Aesthetic Confirmation Email
    const orderConfirmationMail = {
      from: `"Bake-end Bakery Boutique" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `🍰 Order Confirmed! #${savedOrder._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: 'Georgia', serif; background: #FFFDF5; padding: 30px; color: #4A3728; border: 1px solid #C2A382;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 1px solid #C2A382; padding-bottom: 20px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-style: italic; color: #4A3728;">Thank You for your Order!</h1>
              <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px; color: #C2A382; margin-top: 5px;">Bake-end Bakery Boutique</p>
            </div>
            
            <p>Hi ${customer.name},</p>
            <p>We've received your order and our bakers are already getting started! Here's your summary:</p>
            
            <div style="background: #FFFDF5; padding: 20px; border-radius: 10px; margin: 20px 0;">
               <p style="font-size: 12px; margin: 0;"><strong>Order Reference:</strong> #${savedOrder._id}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr>
                <td style="padding: 20px 0; font-weight: bold; font-size: 18px;">Total Amount</td>
                <td style="padding: 20px 0; font-weight: bold; font-size: 18px; text-align: right; color: #C2A382;">₹${totalAmount.toLocaleString()}</td>
              </tr>
            </table>

            <div style="margin-top: 30px; font-size: 13px; line-height: 1.6;">
              <p><strong>Delivery Address:</strong><br/>${customer.address}, ${customer.pincode}</p>
              <p><strong>Payment Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</p>
            </div>

            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; pt-20px;">
              <p style="font-size: 11px; color: #C2A382; text-transform: uppercase; letter-spacing: 1px;">Freshly baked, just for you.</p>
            </div>
          </div>
        </div>
      `
    };

    // 3. Send the Email
    await transporter.sendMail(orderConfirmationMail);

    res.status(200).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("❌ Order/Mail Error:", error);
    res.status(500).json({ success: false, message: "Error processing order." });
  }
});

// Use legacy routes for other order-related tasks if they exist
app.use('/api/orders', orderroutes);

// SUBSCRIBE ROUTE
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const welcomeMail = {
      from: `"Bake-end Bakery Boutique" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🥐 Welcome to the Inner Circle!",
      html: `
        <div style="font-family: serif; padding: 40px; background: #FFFDF5; border: 1px solid #C2A382; text-align: center;">
          <h1 style="color: #4A3728;">Welcome to Bake-end Boutique!</h1>
          <p>You've successfully joined our Secret Ingredient Club.</p>
          <div style="margin: 25px 0; padding: 15px; border: 2px dashed #C2A382; display: inline-block;">
            <p style="font-size: 18px; font-weight: bold; color: #4A3728;">CODE: FRESHBAKE10</p>
          </div>
          <p style="font-size: 12px;">Use this code for 10% off your first purchase.</p>
        </div>
      `
    };

    await transporter.sendMail(welcomeMail);
    return res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'User already exists!' });
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// BUY NOW ROUTES
app.post('/api/orders/buy-now', async (req, res) => {
  const { userId, item } = req.body;
  try {
    const updatedBuyNow = await BuyNow.findOneAndUpdate(
        { userId }, 
        { item, createdAt: new Date() }, 
        { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: updatedBuyNow });
  } catch (error) { 
    res.status(500).json({ message: "Error saving purchase data.", error: error.message }); 
  }
});

app.get('/api/orders/buy-now/:userId', async (req, res) => {
  try {
    const buyNowData = await BuyNow.findOne({ userId: req.params.userId });
    buyNowData ? res.status(200).json(buyNowData) : res.status(404).json({ message: "Not found" });
  } catch (error) { res.status(500).json({ message: "Error fetching buy-now data." }); }
});

// ADMIN ROUTES
app.get('/api/admin/stats', async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.status(200).json({ totalSubscribers: count });
  } catch (error) { res.status(500).json({ message: "Error fetching stats." }); }
});

app.get('/api/admin/subscribers', async (req, res) => {
  try {
    const list = await Subscriber.find().sort({ subscribedAt: -1 });
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ message: "Error fetching subscribers." }); }
});

app.post('/api/admin/broadcast', async (req, res) => {
  const { subject, title, message } = req.body;
  try {
    const subscribers = await Subscriber.find({}, 'email');
    if (subscribers.length === 0) return res.status(404).json({ message: "No subscribers." });
    const emailList = subscribers.map(sub => sub.email);
    await transporter.sendMail({
      from: `"Bake-end Bakery Boutique" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      bcc: emailList,
      subject: subject,
      html: `<div style="font-family: serif; padding: 40px; background: #FFFDF5; border: 1px solid #C2A382;">
                <h1 style="color: #4A3728;">${title || 'Bake-end Updates'}</h1>
                <p>${message}</p>
              </div>`,
    });
    res.status(200).json({ message: "Broadcast sent." });
  } catch (error) { res.status(500).json({ message: "Broadcast failed." }); }
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      res.json({ _id: user._id, name: user.name, email: user.email, token });
    } else { res.status(401).json({ message: 'Invalid email or password' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// COUPON & USER PROFILE
app.post('/api/coupons/verify', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon || new Date() > coupon.expiryDate) return res.status(404).json({ message: 'Invalid code' });
    res.status(200).json({ discountPercentage: coupon.discountPercentage });
  } catch (error) { res.status(500).json({ message: 'Error verifying coupon.' }); }
});

app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    user ? res.json(user) : res.status(404).json({ message: "User not found" });
  } catch (error) { res.status(500).json({ message: "Error fetching profile." }); }
});

// UPDATED PASSWORD ROUTE
app.put('/api/user/update-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({ message: "Updated" });
    } else { 
      res.status(404).json({ message: "User not found" }); 
    }
  } catch (error) { 
    res.status(500).json({ message: "Error updating password." }); 
  }
});

// CONTACT & NOTIFICATIONS
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: 'hellobakeend@gmail.com',
    replyTo: email,
    subject: `Contact: ${subject}`,
    html: `<p><strong>From:</strong> ${name}</p><p>${message}</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Sent!' });
  } catch (error) { res.status(500).json({ message: 'Error sending email.' }); }
});

// FORGOT/RESET PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 600000; // 10 minutes
    await user.save();

    await transporter.sendMail({
      from: `"Bake-end Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Your Reset Code",
      html: `<div style="text-align:center; padding:20px; border:1px solid #C2A382;">
                <h2>Reset Code</h2>
                <h1 style="letter-spacing:10px; color:#4A3728;">${otp}</h1>
              </div>`
    });
    res.status(200).json({ message: "OTP Sent" });
  } catch (err) { res.status(500).json({ message: "Error during forgot password." }); }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      email, 
      resetOtp: otp, 
      resetOtpExpire: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password." });
  }
});

// DEFAULT ROUTE
app.get('/', (req, res) => res.send('Bake-end Bakery API running...'));

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("💥 SERVER ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// START SERVER
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));