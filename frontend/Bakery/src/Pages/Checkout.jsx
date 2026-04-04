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
  QrCode
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
  const [deliveryFee, setDeliveryFee] = useState(35); 
  const [finalTotal, setFinalTotal] = useState(0);

  // PAYMENT STATE
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'qr'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderResponseId, setOrderResponseId] = useState("");

  const [formData, setFormData] = useState({
    name: userInfo?.name || userInfo?.fullName || "",
    phone: "",
    address: "",
    pincode: ""
  });

  // UPI CONFIG
  const BAKERY_UPI_ID = "yourname@bank"; // CHANGE THIS TO YOUR UPI ID
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
    if(paymentMethod === "qr") {
        const confirmed = window.confirm("Have you completed the QR payment?");
        if(!confirmed) return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: userInfo._id,
        customer: { ...formData, email: userInfo.email },
        items: items.map(item => ({ name: item.name, price: Number(item.price), quantity: Number(item.quantity), img: item.img || "" })),
        subtotal, tax, deliveryFee: 35, totalAmount: finalTotal,
        paymentMethod, status: "Pending"
      };
      const response = await axios.post(`${API_URL}/api/orders`, orderData);
      if (response.data.success) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdate"));
        setOrderResponseId(response.data.order._id);
        setIsOrdered(true);
      }
    } catch (err) {
      alert("Error placing order. Try again.");
    } finally { setIsSubmitting(false); }
  };

  if (isOrdered) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-md w-full">
        <PackageCheck size={60} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#4A3728]">Order Placed!</h1>
        <p className="text-gray-500 my-4">Order ID: {orderResponseId}</p>
        <button onClick={() => navigate("/products")} className="w-full bg-[#4A3728] text-white py-3 rounded-xl">Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10">
          
          {/* LEFT SECTION */}
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-3xl font-bold text-[#4A3728]">Delivery Details</h1>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50 space-y-4">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-[#F9F9F9] p-4 rounded-xl border" />
              <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-[#F9F9F9] p-4 rounded-xl border" />
              <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Shipping Address" rows="3" className="w-full bg-[#F9F9F9] p-4 rounded-xl border" />
              <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full bg-[#F9F9F9] p-4 rounded-xl border" />
            </div>

            {/* PAYMENT SELECTION AREA */}
            <div className="space-y-3">
               {/* COD BOX */}
              <div 
                onClick={() => setPaymentMethod("cod")}
                className={`p-6 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'bg-[#4A3728] text-white shadow-lg' : 'bg-white text-[#4A3728] border border-gray-200'}`}
              >
                <div className="flex items-center gap-4">
                  <Banknote />
                  <div>
                    <p className="font-bold">Cash on Delivery</p>
                    <p className={`text-xs ${paymentMethod === 'cod' ? 'text-orange-200' : 'text-gray-400'}`}>Pay when your cakes arrive</p>
                  </div>
                </div>
                {paymentMethod === "cod" && <CheckCircle className="text-orange-300" />}
              </div>

              {/* QR BOX */}
              <div 
                onClick={() => setPaymentMethod("qr")}
                className={`p-6 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'qr' ? 'bg-[#4A3728] text-white shadow-lg' : 'bg-white text-[#4A3728] border border-gray-200'}`}
              >
                <div className="flex items-center gap-4">
                  <QrCode />
                  <div>
                    <p className="font-bold">Online Payment (QR)</p>
                    <p className={`text-xs ${paymentMethod === 'qr' ? 'text-orange-200' : 'text-gray-400'}`}>Scan and pay instantly</p>
                  </div>
                </div>
                {paymentMethod === "qr" && <CheckCircle className="text-orange-300" />}
              </div>
            </div>

            {/* QR DISPLAY LOGIC */}
            {paymentMethod === "qr" && (
              <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-[#4A3728] text-center">
                <p className="font-bold text-[#4A3728] mb-3">Scan to Pay: ₹{finalTotal}</p>
                <div className="bg-white p-2 inline-block rounded-lg shadow-md">
                  <QRCodeSVG value={upiString} size={150} />
                </div>
              </div>
            )}

            <button onClick={handleConfirmOrder} disabled={isSubmitting} className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold text-xl hover:opacity-90 shadow-xl flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Order"}
            </button>
          </div>

          {/* RIGHT SECTION: SUMMARY */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-28">
              <h2 className="text-2xl font-bold text-[#4A3728] mb-6 flex items-center gap-2"><Package className="text-orange-700" /> Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b pb-4">
                    <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-[#4A3728]">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-gray-600 border-t pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>GST (5%)</span><span>₹{tax}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>₹35</span></div>
                <div className="flex justify-between text-xl font-black text-[#4A3728] pt-4"><span>Total</span><span>₹{finalTotal}</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;