import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Banknote,
  Loader2,
  PackageCheck,
  MapPin,
  Phone,
  User,
  QrCode,
  CreditCard
} from "lucide-react";
import axios from "axios";
import { QRCodeSVG } from "react-qr-code";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "https://bake-end-bakery-drnf.vercel.app";

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [items] = useState(location.state?.items || []);
  const [discountAmount] = useState(location.state?.discount || 0);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee] = useState(35);
  const [finalTotal, setFinalTotal] = useState(0);

  // --- CRITICAL PAYMENT STATE ---
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "qr"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderResponseId, setOrderResponseId] = useState("");

  const [formData, setFormData] = useState({
    name: userInfo?.name || userInfo?.fullName || "",
    phone: "",
    address: "",
    pincode: ""
  });

  // UPI Config for QR
  const BAKERY_UPI_ID = "bake-end@ybl"; 
  const upiString = `upi://pay?pa=${BAKERY_UPI_ID}&pn=Bake-end Bakery&am=${finalTotal}&cu=INR`;

  useEffect(() => {
    if (!items || items.length === 0) return;
    const calculatedSubtotal = items.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
    const calculatedTax = Math.round(calculatedSubtotal * 0.05);
    const total = calculatedSubtotal + calculatedTax + 35 - discountAmount;
    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setFinalTotal(total);
  }, [items, discountAmount]);

  useEffect(() => {
    if (!userInfo) navigate("/login?redirect=checkout");
    if (!location.state?.items) navigate("/cart");
  }, [userInfo, navigate, location.state]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === "qr") {
      const confirmPay = window.confirm("Did you scan and complete the payment?");
      if (!confirmPay) return;
    }
    
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: userInfo._id,
        customer: { ...formData, email: userInfo.email },
        items: items.map(item => ({ name: item.name, price: Number(item.price), quantity: Number(item.quantity), img: item.img || "" })),
        subtotal, tax, deliveryFee, totalAmount: finalTotal,
        paymentMethod, 
        status: "Pending"
      };
      const response = await axios.post(`${API_URL}/api/orders`, orderData);
      if (response.data.success) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdate"));
        setOrderResponseId(response.data.order._id);
        setIsOrdered(true);
      }
    } catch (err) {
      alert("Failed to place order. Check your connection.");
    } finally { setIsSubmitting(false); }
  };

  if (isOrdered) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-md w-full border border-orange-100">
        <PackageCheck size={60} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#4A3728]">Order Placed!</h1>
        <p className="text-gray-500 my-4">Order ID: <span className="font-mono font-bold">{orderResponseId}</span></p>
        <button onClick={() => navigate("/products")} className="w-full bg-[#4A3728] text-white py-4 rounded-xl font-bold">Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#4A3728] mb-8 font-medium">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-4xl font-bold text-[#4A3728]">Delivery Details</h1>
            
            <form onSubmit={handleConfirmOrder} className="space-y-6">
              {/* Form Section */}
              <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5 border border-orange-50">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-[#F9F9F9] p-4 rounded-xl border-none outline-none focus:ring-2 ring-[#4A3728]/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-[#F9F9F9] p-4 rounded-xl border-none outline-none focus:ring-2 ring-[#4A3728]/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500">Shipping Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3" className="w-full bg-[#F9F9F9] p-4 rounded-xl border-none outline-none focus:ring-2 ring-[#4A3728]/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full bg-[#F9F9F9] p-4 rounded-xl border-none outline-none focus:ring-2 ring-[#4A3728]/10" />
                </div>
              </div>

              {/* PAYMENT SECTION - DYNAMIC TOGGLE */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#4A3728]">How would you like to pay?</h3>
                
                <div className="flex flex-col gap-3">
                  {/* COD BUTTON */}
                  <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-6 rounded-2xl cursor-pointer flex items-center justify-between border-2 transition-all ${paymentMethod === 'cod' ? 'bg-[#4A3728] border-[#4A3728] text-white' : 'bg-white border-gray-100 text-[#4A3728]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <Banknote size={24} />
                      <div>
                        <p className="font-bold">Cash on Delivery</p>
                        <p className={`text-xs ${paymentMethod === 'cod' ? 'text-orange-200' : 'text-gray-400'}`}>Pay when your cakes arrive</p>
                      </div>
                    </div>
                    {paymentMethod === "cod" && <CheckCircle className="text-orange-300" />}
                  </div>

                  {/* QR BUTTON */}
                  <div 
                    onClick={() => setPaymentMethod("qr")}
                    className={`p-6 rounded-2xl cursor-pointer flex items-center justify-between border-2 transition-all ${paymentMethod === 'qr' ? 'bg-[#4A3728] border-[#4A3728] text-white' : 'bg-white border-gray-100 text-[#4A3728]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <QrCode size={24} />
                      <div>
                        <p className="font-bold">Scan & Pay (Online)</p>
                        <p className={`text-xs ${paymentMethod === 'qr' ? 'text-orange-200' : 'text-gray-400'}`}>Scan the QR code to pay instantly</p>
                      </div>
                    </div>
                    {paymentMethod === "qr" && <CheckCircle className="text-orange-300" />}
                  </div>
                </div>

                {/* QR DISPLAY AREA */}
                {paymentMethod === "qr" && (
                  <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-[#4A3728] flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-white p-4 rounded-2xl shadow-xl mb-4 border border-gray-100">
                      <QRCodeSVG value={upiString} size={180} />
                    </div>
                    <p className="text-[#4A3728] font-bold text-lg">Total: ₹{finalTotal}</p>
                    <p className="text-gray-400 text-xs mt-2 italic text-center">Scan using GPay, PhonePe, or any UPI App</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#4A3728] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#3d2d21] transition-all shadow-xl flex justify-center items-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Order"}
              </button>
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-orange-50 sticky top-28">
              <h2 className="text-2xl font-bold text-[#4A3728] mb-6 flex items-center gap-2"><Package size={22} className="text-orange-700" /> Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b pb-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-[#4A3728]">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#4A3728]">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-2 border-t border-dashed">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>₹{tax}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>₹35</span></div>
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