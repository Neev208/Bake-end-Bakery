import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Banknote,
  Loader2,
  PackageCheck,
  AlertCircle,
  MapPin,
  Phone,
  User
} from "lucide-react";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "https://bake-end-bakery-drnf.vercel.app";

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // State management for order details
  const [items] = useState(location.state?.items || []);
  const [discountAmount] = useState(location.state?.discount || 0);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(35); // Matches your image (₹35)
  const [finalTotal, setFinalTotal] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("cod"); // Default to COD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderResponseId, setOrderResponseId] = useState("");

  const [formData, setFormData] = useState({
    name: userInfo?.name || userInfo?.fullName || "",
    phone: "",
    address: "",
    pincode: ""
  });

  // Calculate totals whenever items change
  useEffect(() => {
    if (!items || items.length === 0) return;

    const calculatedSubtotal = items.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );

    const calculatedTax = Math.round(calculatedSubtotal * 0.05); // 5% GST
    const calculatedDelivery = 35; 
    const total = calculatedSubtotal + calculatedTax + calculatedDelivery - discountAmount;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setDeliveryFee(calculatedDelivery);
    setFinalTotal(total);
  }, [items, discountAmount]);

  // Security & Navigation guard
  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=checkout");
    }
    if (!location.state || !location.state.items) {
      navigate("/cart");
    }
  }, [userInfo, navigate, location.state]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        userId: userInfo._id,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          email: userInfo.email
        },
        items: items.map((item) => ({
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          img: item.img || item.image || ""
        })),
        subtotal,
        tax,
        deliveryFee,
        discountAmount,
        totalAmount: finalTotal,
        paymentMethod: "cod",
        status: "Pending"
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData);

      if (response.data.success) {
        localStorage.removeItem("cart");
        // Notify other components (Navbar) that cart is now empty
        window.dispatchEvent(new Event("cartUpdate"));
        setOrderResponseId(response.data.order._id);
        setIsOrdered(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userInfo) return null;

  /* ---------- SUCCESS VIEW ---------- */
  if (isOrdered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-6">
        <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-md w-full border border-orange-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A3728] mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-6">Thank you for choosing Bake-end Bakery. Your treats will arrive soon!</p>
          <div className="bg-[#F6F1EB] p-4 rounded-xl text-sm font-mono text-[#4A3728] mb-8">
            Order ID: <span className="font-bold">{orderResponseId}</span>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-[#4A3728] text-white py-3.5 rounded-xl font-semibold hover:bg-[#3d2d21] transition-all shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ---------- MAIN CHECKOUT VIEW ---------- */
  return (
    <div className="min-h-screen bg-[#FDF8F3] pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#4A3728] font-medium mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* LEFT: FORM SECTION (3 columns) */}
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-4xl font-bold text-[#4A3728]">Delivery Details</h1>
            
            <form onSubmit={handleConfirmOrder} className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5 border border-orange-50">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your name" 
                    required 
                    className="w-full bg-[#F9F9F9] p-3.5 rounded-xl outline-none border focus:border-[#4A3728] transition" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input 
                    name="phone" 
                    type="tel"
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="e.g. +91 9876543210" 
                    required 
                    className="w-full bg-[#F9F9F9] p-3.5 rounded-xl outline-none border focus:border-[#4A3728] transition" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <MapPin size={14} /> Shipping Address
                  </label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    placeholder="Street, Landmark, Apartment" 
                    required 
                    rows="3" 
                    className="w-full bg-[#F9F9F9] p-3.5 rounded-xl outline-none border focus:border-[#4A3728] transition" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600">Pincode</label>
                    <input 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleInputChange} 
                      placeholder="362001" 
                      required 
                      className="w-full bg-[#F9F9F9] p-3.5 rounded-xl outline-none border focus:border-[#4A3728] transition" 
                    />
                   </div>
                </div>
              </div>

              {/* PAYMENT BOX */}
              <div
                className="bg-[#4A3728] text-white p-6 rounded-2xl flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-4">
                  <Banknote size={24} />
                  <div>
                    <p className="font-bold">Cash on Delivery</p>
                    <p className="text-xs text-orange-200">Pay when your cakes arrive</p>
                  </div>
                </div>
                <CheckCircle size={24} className="text-orange-300" />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#3d2d21] transition-all shadow-xl disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Placing Order...
                  </div>
                ) : (
                  "Confirm Order"
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: SUMMARY SECTION (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-50 sticky top-28">
              <h2 className="text-2xl font-bold text-[#4A3728] mb-6 flex items-center gap-2">
                <Package size={22} className="text-orange-700" /> Order Summary
              </h2>
              
              <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-gray-50 pb-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-[#4A3728]">{item.name}</p>
                      <p className="text-xs text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#4A3728]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-dashed">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                    <span>Discount Applied</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-black text-[#4A3728] border-t pt-4 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;