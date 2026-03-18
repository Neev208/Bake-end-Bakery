import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  ArrowLeft, ShoppingBag, CreditCard, Star, 
  PenTool, Check, Minus, Plus, Scale, 
  Zap, Flame, Droplets, Leaf
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const API_URL = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personalization, setPersonalization] = useState(location.state?.customText || "");
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // For Fragmentation toggle

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === 'undefined' || id === ':id') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        // Mocking nutritional data if not present in DB
        const enhancedData = {
          ...res.data,
          protein: res.data.protein || "8g",
          calories: res.data.calories || "320 kcal",
          carbs: res.data.carbs || "42g",
          fat: res.data.fat || "14g",
          fragmentation: res.data.fragmentation || [
            "Hand-milled organic flour",
            "48-hour slow fermentation",
            "Single-origin Madagascar vanilla",
            "Cold-pressed artisan fats"
          ]
        };
        setProduct(enhancedData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- 2. PRICING LOGIC ---
  const calculatedPrice = useMemo(() => {
    if (!product || !product.price) return 0;
    const basePrice = typeof product.price === 'string' 
      ? parseInt(product.price.replace(/[^0-9]/g, '')) 
      : product.price;

    let total = basePrice;
    if (product.cat === "Cakes" || product.category === "Cakes") {
        total = total * weight;
    }
    return total * quantity;
  }, [product, weight, quantity]);

  const displayPrice = `₹${calculatedPrice.toLocaleString()}`;

  // --- 3. HANDLERS ---
  const handleIncrease = () => { if (quantity < 10) setQuantity(prev => prev + 1); };
  const handleDecrease = () => { if (quantity > 1) setQuantity(prev => prev - 1); };
  const handleWeightUp = () => { if (weight < 5) setWeight(prev => prev + 0.5); };
  const handleWeightDown = () => { if (weight > 0.5) setWeight(prev => prev - 0.5); };

  const saveToCart = async () => {
    if (!product) return;
    const newItem = {
      productId: product._id,
      name: product.name,
      price: calculatedPrice,
      quantity: quantity,
      selectedWeight: product.cat === "Cakes" ? `${weight}kg` : null,
      selectedPersonalization: personalization,
      img: product.img,
      cartId: Date.now(), 
    };
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, newItem]));
    window.dispatchEvent(new Event("storage"));

    try {
      const userId = "user123"; 
      await axios.post(`${API_URL}/api/cart/add`, { userId, item: newItem });
    } catch (err) {
      console.error("MongoDB Sync Error:", err);
    }
  };

  // --- FIXED BUY NOW HANDLER ---
  const handleBuyNow = async () => {
    if (!product) return;

    const buyNowItem = {
      productId: product._id,
      name: product.name,
      price: calculatedPrice,
      quantity: quantity,
      selectedWeight: (product.cat === "Cakes") ? `${weight}kg` : null,
      selectedPersonalization: personalization,
      img: product.img,
      isDirectBuy: true 
    };

    // 1. Store in LocalStorage for persistence on Checkout page refresh
    localStorage.setItem("buyNowTemp", JSON.stringify(buyNowItem));

    // 2. Optional: Store in DB for recovery if user is logged in
    try {
      const userId = "user123"; // Replace with actual user ID logic
      await axios.post(`${API_URL}/api/orders/buy-now`, { userId, item: buyNowItem });
    } catch (err) {
      console.warn("DB Storage failed, proceeding with local data.");
    }

    // 3. Navigate with state - Set paymentMethod to "cod"
    navigate("/checkout", { 
      state: { 
        items: [buyNowItem], 
        totalAmount: calculatedPrice,
        paymentMethod: "cod", // Changed from "online" to "cod"
        isBuyNow: true 
      } 
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
      <div className="text-[#C2A382] font-serif text-2xl animate-pulse italic">Preparing your treat...</div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center text-[#4A3728]">
      <h2 className="text-3xl font-serif mb-6 italic">Product not found</h2>
      <button onClick={() => navigate('/')} className="px-10 py-4 bg-[#4A3728] text-[#FFFDF5] rounded-full font-black uppercase tracking-widest text-xs">
        Return to Boutique
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-20 px-6 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[#C2A382] hover:text-[#4A3728] transition-all mb-12">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="uppercase tracking-[0.3em] text-[10px] font-black">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* --- LEFT: VISUALS & NUTRITION --- */}
          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl shadow-[#4A3728]/10 bg-white">
              <img 
                src={product.img && product.img.startsWith('http') ? product.img : `${API_URL}/uploads/${product.img}`} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Nutritional Grid */}
            <div className="grid grid-cols-4 gap-4">
              <NutrientCard icon={<Flame size={16}/>} label="Calories" value={product.calories} />
              <NutrientCard icon={<Zap size={16}/>} label="Protein" value={product.protein} />
              <NutrientCard icon={<Leaf size={16}/>} label="Carbs" value={product.carbs} />
              <NutrientCard icon={<Droplets size={16}/>} label="Fat" value={product.fat} />
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO & TABS --- */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col space-y-8">
            <div>
              <span className="text-[#C2A382] font-black uppercase tracking-[0.4em] text-[10px]">{product.cat}</span>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold mt-4 text-[#4A3728] leading-[1.1]">{product.name}</h1>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-5xl font-serif font-bold text-[#4A3728]">{displayPrice}</span>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-[#C2A382]/20 shadow-sm">
                <Star size={16} fill="#C2A382" className="text-[#C2A382]" />
                <span className="text-[#4A3728] text-sm font-black">{product.rating || "4.9"}</span>
              </div>
            </div>

            {/* Fragmentation & Description Tabs */}
            <div className="space-y-4">
              <div className="flex gap-8 border-b border-[#C2A382]/20">
                {["description", "fragmentation"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] uppercase font-black tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-[#4A3728]' : 'text-[#C2A382]'}`}
                  >
                    {tab}
                    {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3728]" />}
                  </button>
                ))}
              </div>
              <div className="min-h-[100px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[#5F5248] text-lg leading-relaxed font-medium"
                  >
                    {activeTab === "description" ? (
                      product.desc || "Exquisite artisan creation, handcrafted daily with the finest ingredients."
                    ) : (
                      <ul className="grid grid-cols-1 gap-3">
                        {product.fragmentation.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <Check size={14} className="text-[#C2A382]" />
                            <span className="tracking-wide">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Configuration Controls */}
            <div className="space-y-6">
              {product.cat === "Cakes" && (
                <div className="space-y-6 bg-white p-8 rounded-[2rem] border border-[#C2A382]/20 shadow-lg shadow-[#4A3728]/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale size={16} className="text-[#C2A382]" />
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#C2A382] font-black">Weight Selection</label>
                    </div>
                    <div className="flex items-center gap-5">
                      <button onClick={handleWeightDown} className="w-10 h-10 rounded-full border border-[#C2A382]/30 flex items-center justify-center text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all"><Minus size={14}/></button>
                      <span className="text-xl font-serif font-bold w-16 text-center">{weight}kg</span>
                      <button onClick={handleWeightUp} className="w-10 h-10 rounded-full border border-[#C2A382]/30 flex items-center justify-center text-[#4A3728] hover:bg-[#4A3728] hover:text-white transition-all"><Plus size={14}/></button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <PenTool size={16} className="text-[#C2A382]" />
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#C2A382] font-black">Personalization</label>
                    </div>
                    <input 
                      type="text" 
                      value={personalization}
                      onChange={(e) => setPersonalization(e.target.value)}
                      placeholder="MESSAGE ON CAKE (OPTIONAL)"
                      className="w-full bg-[#FFFDF5] border border-[#C2A382]/20 rounded-xl py-4 px-6 text-[#4A3728] font-bold text-[10px] tracking-[0.1em] outline-none focus:border-[#4A3728] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C2A382] font-black">Order Quantity</span>
                  <div className="flex items-center bg-white rounded-full p-1 border border-[#C2A382]/20">
                    <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center text-[#4A3728]"><Minus size={12}/></button>
                    <span className="w-8 text-center font-black text-sm">{quantity}</span>
                    <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center text-[#4A3728]"><Plus size={12}/></button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => { saveToCart(); setIsAdded(true); setTimeout(() => setIsAdded(false), 2000); }} 
                    className={`flex-[2] py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all ${isAdded ? 'bg-green-700 text-white shadow-lg' : 'bg-[#4A3728] text-[#FFFDF5] hover:bg-[#C2A382] shadow-xl shadow-[#4A3728]/20'}`}
                  >
                    {isAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
                    {isAdded ? "Added to Cart" : "Add to Boutique"}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow} 
                    className="flex-1 border-2 border-[#4A3728] py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#4A3728] hover:text-[#FFFDF5] transition-all"
                  >
                    <CreditCard size={16} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT FOR NUTRITION ---
const NutrientCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-[#C2A382]/10 shadow-sm flex flex-col items-center text-center gap-1 hover:border-[#C2A382]/40 transition-colors group">
    <div className="text-[#C2A382] group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[8px] uppercase font-black tracking-widest text-[#C2A382]">{label}</span>
    <span className="text-xs font-bold text-[#4A3728]">{value}</span>
  </div>
);

export default ProductDetail;