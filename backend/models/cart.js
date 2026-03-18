import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String },
      cartId: { type: Number }, 
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
      selectedWeight: { type: String },
      selectedPersonalization: { type: String },
      img: { type: String },
    }
  ]
}, { timestamps: true });

// CHANGE THIS LINE:
// Previously it might have been: module.exports = mongoose.model('Cart', cartSchema);
// It MUST be:
export default mongoose.model('cart', cartSchema);