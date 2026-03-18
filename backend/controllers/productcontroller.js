import Product from '../models/product.js';
import mongoose from 'mongoose';
import { notifySubscribersNewItem } from '../utils/mailer.js'; 

// 1. GET ALL PRODUCTS (Enhanced with Filter & Search)
export const getProducts = async (req, res) => {
  try {
    const { cat, search } = req.query;
    let query = {};

    if (cat && cat.toUpperCase() !== 'ALL') {
      query.cat = { $regex: new RegExp(`^${cat}$`, 'i') };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    console.log(`📦 DB Search for [Category: ${cat || 'All'}] returned ${products.length} products.`);
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ GetProducts Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({ message: "Valid Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findById(id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found in database" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. CREATE PRODUCT (Admin Function with Email Notification)
export const createProduct = async (req, res) => {
  try {
    const { name, price, desc, img, cat, calories, protein } = req.body;

    if (!name || !price || !cat) {
      return res.status(400).json({ message: "Name, Price, and Category are required." });
    }

    const newProduct = new Product({ 
      name, 
      price, 
      desc, 
      img, 
      cat, 
      calories, 
      protein 
    });

    const savedProduct = await newProduct.save();
    console.log(`✅ Product created: ${savedProduct.name}`);

    // --- AUTOMATIC EMAIL NOTIFICATION ---
    // This will now always work because it's imported from a stable utility file
    notifySubscribersNewItem(savedProduct)
      .then(() => console.log(`📧 Notification broadcast sent for: ${savedProduct.name}`))
      .catch(err => console.error("❌ Email Broadcast Error:", err.message));

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ CreateProduct Error:", error.message);
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
};