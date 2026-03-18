import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  // KEY FIX: This must be an Array [ ] to store multiple items
  items: [
    {
      productId: { type: String },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      selectedWeight: { type: String },
      img: { type: String }
    }
  ],
  subtotal: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "cod" },
  status: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now }
});

// Ensure this matches your import name in orderroutes.js
const Order = mongoose.model("Order", orderSchema);
export default Order;