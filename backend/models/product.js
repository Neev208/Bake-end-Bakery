import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  cat: { type: String, required: true }, 
  calories: { type: String },
  protein: { type: String },
  sound: { type: String, default: "" },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;