const express = require("express");
const router = express.Router();
const Coupon = require("../models/coupon");

// POST /api/coupons/verify
router.post("/verify", async (req, res) => {
  try {
    const { code } = req.body;

    // 1. Search for the coupon (Case-insensitive)
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    // 2. If coupon doesn't exist
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    // 3. Check if expired
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    // 4. Success - Send back the percentage
    res.json({ 
      discountPercentage: coupon.discountPercentage,
      message: "Coupon applied successfully!" 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;