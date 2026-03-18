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

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Retrieve items and discount from the previous page state
  const [items] = useState(location.state?.items || []);
  const [discountAmount] = useState(location.state?.discount || 0); 

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentError, setPaymentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderResponseId, setOrderResponseId] = useState("");

  const [formData, setFormData] = useState({
    name: userInfo?.name || userInfo?.fullName || "",
    phone: "",
    address: "",
    pincode: ""
  });

  useEffect(() => {
    if (!items || items.length === 0) return;

    // 1. Calculate Subtotal
    const calculatedSubtotal = items.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );

    // 2. Calculate Tax (5%)
    const calculatedTax = Math.round(calculatedSubtotal * 0.05);

    // 3. Match Delivery Fee to Cart (Set to 35 to match your image)
    // If you want free delivery over 500, use: calculatedSubtotal > 500 ? 0 : 35;
    const calculatedDelivery = 35; 

    // 4. Calculate Final Total including the Discount
    const total =
      calculatedSubtotal + calculatedTax + calculatedDelivery - discountAmount;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setDeliveryFee(calculatedDelivery);
    setFinalTotal(total);
  }, [items, discountAmount]);

  useEffect(() => {
    if (!userInfo) {
      alert("Please login to place an order.");
      navigate("/login?redirect=checkout");
    }
    if (!location.state) navigate("/cart");
  }, [userInfo, navigate, location.state]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod !== "cod") {
      setPaymentError(true);
      return;
    }

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
        window.dispatchEvent(new Event("cartUpdate"));
        setOrderResponseId(response.data.order._id);
        setIsOrdered(true);
      }
    } catch (err) {
      alert("Order failed. Try again.");
    }

    setIsSubmitting(false);
  };

  if (!userInfo) return null;

  /* ---------- SUCCESS PAGE ---------- */
  if (isOrdered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7F0] px-6">
        <div className="bg-white shadow-2xl rounded-3xl p-12 text-center max-w-md w-full">
          <PackageCheck size={50} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Order Confirmed 🎉</h1>
          <p className="text-gray-500 mb-6">Your bakery treats are being prepared!</p>
          <div className="bg-[#F6F1EB] p-4 rounded-xl text-sm font-mono mb-6">
            Order ID : {orderResponseId}
          </div>
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-[#4A3728] text-white py-3 rounded-xl hover:bg-[#6b4f3a] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ---------- CHECKOUT PAGE ---------- */
  return (
    <div className="min-h-screen bg-[#FFF7F0] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* LEFT SIDE: Delivery Details */}
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#4A3728] mb-8">
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-4xl font-bold mb-8">Delivery Details</h1>
          <form onSubmit={handleConfirmOrder} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <User size={18} />
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required className="w-full outline-none" />
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />
                <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" required rows="3" className="w-full outline-none" />
              </div>
              <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" required className="w-full border p-2 rounded-lg" />
            </div>

            <div
              onClick={() => {setPaymentMethod("cod"); setPaymentError(false);}}
              className={`cursor-pointer p-5 rounded-xl border transition ${paymentMethod === "cod" ? "bg-[#4A3728] text-white" : "bg-white"}`}
            >
              <div className="flex items-center gap-3">
                <Banknote size={20} />
                Cash on Delivery
                {paymentMethod === "cod" && <CheckCircle size={18} className="ml-auto" />}
              </div>
            </div>

            {paymentError && (
              <div className="text-red-500 flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> Select payment method
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full bg-[#4A3728] text-white py-4 rounded-xl hover:bg-[#6b4f3a]">
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Confirm Order"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-xl h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package size={22} /> Order Summary
          </h2>
          <div className="space-y-5 mb-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img src={item.img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount Applied</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;