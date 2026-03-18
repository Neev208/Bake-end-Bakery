import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js"; 
import connectDB from "./config/db.js";

dotenv.config();

const newItem = {
  id: 41,
  name: "Strawberry Tart",
  cat: "Pastries & Sweets",
  price: "₹350",
  calories: "280 kcal",
  protein: "4g",
  img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
  desc: "Fresh strawberries on a vanilla cream base.",
  rating: 4.9,
  reviews: 15
};

const addItem = async () => {
  try {
    // 1. Connect to the SAME database your app uses
    await connectDB();
    
    // 2. Insert the item
    console.log("🍰 Adding Strawberry Tart...");
    await Product.create(newItem);

    console.log("✅ Success! Item added.");
    console.log("👉 Now refresh your website page.");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    
    // If error is duplicate key, it means it's already there!
    if (error.code === 11000) {
      console.log("⚠️ This item ID already exists. Change the 'id' number in the code.");
    }
    process.exit(1);
  }
};

addItem();