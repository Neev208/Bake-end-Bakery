const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  discountPercentage: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiryDate: { 
    type: Date, 
    default: () => new Date(+new Date() + 30*24*60*60*1000) // Default 30 days from now
  }
});

module.exports = mongoose.model("Coupon", couponSchema);