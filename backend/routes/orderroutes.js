import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// --- 1. DEFINE THE ORDER SCHEMA ---
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    img: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  status: { type: String, default: 'Pending' }, // Pending, Baking, Out for Delivery, Delivered, Cancelled
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// --- 2. CREATE ORDER (AUTHENTICATION GUARDED) ---
router.post('/', async (req, res) => {
  try {
    const { userId, customer, items, totalAmount } = req.body;

    // SECURITY CHECK: Block guest orders
    if (!userId || userId === "guest") {
      return res.status(401).json({ 
        success: false, 
        message: "You must be logged in to place an order." 
      });
    }

    const newOrder = new Order({
      userId,
      customer,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: req.body.paymentMethod || 'COD',
      status: "Pending",
      orderDate: new Date()
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Your fresh batch has been ordered!",
      order: savedOrder 
    });

  } catch (error) {
    console.error("❌ Order Creation Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to place order", 
      error: error.message 
    });
  }
});

// --- 3. GET ORDERS FOR A SPECIFIC USER ---
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error: error.message });
  }
});

// --- 4. CANCEL ORDER (ONLY IF PENDING) ---
router.delete('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Users can only cancel if it hasn't started baking yet
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: "Order cannot be cancelled once baking starts." });
    }

    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ success: true, message: "Order cancelled successfully." });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 5. GET ALL ORDERS (FOR ADMIN PANEL) ---
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;