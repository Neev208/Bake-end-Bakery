import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ArrowLeft, ShieldCheck, Loader2, X } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  const getUserInfo = () => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  };

  const user = getUserInfo();
  const userId = user?._id || "guest";

  const syncCartData = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (userId !== "guest") {
        try {
          const res = await axios.get(`${API_URL}/api/cart/${userId}`);
          if (res.data && res.data.items) {
            const combined = [...localCart, ...res.data.items];
            const uniqueItems = Array.from(
              new Map(combined.map(item => [item.cartId || item._id, item])).values()
            );
            setCartItems(uniqueItems);
            localStorage.setItem("cart", JSON.stringify(uniqueItems));
          }
        } catch (dbErr) {
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCartData();
    const handleStorageChange = () => syncCartData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setIsVerifying(true);
    setCouponError("");
    try {
      const response = await axios.post(`${API_URL}/api/coupons/verify`, { code: couponCode });
      setDiscount(response.data.discountPercentage);
      setAppliedCoupon(couponCode.toUpperCase());
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid Code");
      setDiscount(0);
    } finally {
      setIsVerifying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  const parsePrice = (p) => {
    if (!p) return 0;
    const num = parseFloat(p.toString().replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((total, item) => total + (parsePrice(item.price) * (item.quantity || 1)), 0);
  // Matches Checkout logic: 35 delivery if under 500
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 35;
  const tax = Math.round(subtotal * 0.05); 
  const discountAmount = Math.round((subtotal * discount) / 100);
  const finalTotal = subtotal + deliveryFee + tax - discountAmount;

  const removeItem = async (targetId) => {
    const updatedCart = cartItems.filter((item) => (item.cartId || item._id) !== targetId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (userId !== "guest") {
      try { await axios.delete(`${API_URL}/api/cart/${userId}/item/${targetId}`); } catch (err) {}
    }
    // Dispatch local event to update Navbar/other components
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Pass strictly named state to match Checkout.jsx
    navigate("/checkout", {
      state: { 
        items: cartItems,
        discount: discountAmount, // Passed as 'discount' for Checkout's state
        subtotal: subtotal
      },
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C2A382]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT: Cart Items */}
        <div className="lg:col-span-7">
          <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-[#C2A382] uppercase tracking-[0.3em] text-[10px] font-black mb-8 hover:text-[#4A3728] transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </button>
          
          <h1 className="text-5xl font-serif font-bold mb-12">
            Your <span className="text-[#C2A382] italic font-light">Selection.</span>
          </h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-[#C2A382]/40">
                <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.cartId || item._id} className="flex gap-6 bg-white p-6 rounded-[2.5rem] border border-[#C2A382]/20 shadow-xl">
                  <div className="w-24 h-24 bg-[#FFFDF5] rounded-2xl overflow-hidden shrink-0">
                    <img src={item.img || item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-serif font-bold">{item.name}</h3>
                      <p className="font-bold text-[#C2A382]">₹{parsePrice(item.price).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#C2A382]">
                      <span className="bg-[#FFFDF5] px-3 py-1 rounded-full border border-[#C2A382]/20">Quantity: {item.quantity || 1}</span>
                      <button onClick={() => removeItem(item.cartId || item._id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Totals and Checkout */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Coupon Section */}
          <div className="bg-white border border-[#C2A382]/20 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-4">Coupon Code</h3>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                    className="flex-1 bg-[#FFFDF5] border border-[#C2A382]/30 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#4A3728]" 
                    placeholder="ENTER CODE" 
                />
                <button onClick={applyCoupon} disabled={isVerifying} className="bg-[#4A3728] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-[#C2A382] transition-colors">
                    {isVerifying ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-100 p-4 rounded-xl">
                <span className="text-[10px] font-black text-green-700">CODE APPLIED: {appliedCoupon} (-{discount}%)</span>
                <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded-full transition-colors">
                    <X size={14} className="text-green-700"/>
                </button>
              </div>
            )}
            {couponError && <p className="text-red-500 text-[9px] font-bold mt-2 uppercase tracking-tighter">{couponError}</p>}
          </div>

          {/* Totals Section */}
          <div className="bg-white border border-[#C2A382]/20 rounded-[3rem] p-10 shadow-2xl">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-70">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-70">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest opacity-70">
                <span>GST (5%)</span><span>₹{tax.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-green-600 uppercase tracking-widest">
                  <span>Discount</span><span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-[#4A3728]/10 pt-6 flex justify-between items-end mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest">Final Total</span>
              <span className="text-4xl font-serif font-bold text-[#C2A382]">₹{finalTotal.toLocaleString()}</span>
            </div>
            
            <button 
                onClick={handleCheckout} 
                disabled={cartItems.length === 0}
                className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all ${
                    cartItems.length === 0 
                    ? 'bg-gray-200 cursor-not-allowed text-gray-400' 
                    : 'bg-[#4A3728] text-white hover:bg-[#C2A382] active:scale-[0.98]'
                }`}
            >
              <ShieldCheck size={18} /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;