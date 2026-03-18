import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, RotateCcw, Layers, Palette, 
  BoxSelect, Sparkles, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import axios from "axios";

// --- THEME CONFIGURATION (Refined Prices) ---
const STUDIO_CONFIG = {
  steps: [
    { id: 'size', label: 'Dimensions', icon: Layers, tilt: 0 },
    { id: 'flavor', label: 'Cuisine', icon: Palette, tilt: 15 },
    { id: 'frosting', label: 'Finish', icon: BoxSelect, tilt: -15 },
    { id: 'decor', label: 'Adornments', icon: Sparkles, tilt: 5 },
  ],
  options: {
    size: [
      { id: "s", label: "The Petite", weight: "0.5kg", price: 350, tiers: 1, scale: 0.75 },
      { id: "m", label: "The Signature", weight: "1.0kg", price: 650, tiers: 2, scale: 0.95 },
      { id: "l", label: "The Grand", weight: "2.0kg", price: 1200, tiers: 3, scale: 1.15 },
    ],
    flavor: [
      { id: "vanilla", label: "Madagascar Bean", color: "#F9F5E3", dark: "#E6D5B8", price: 0 },
      { id: "chocolate", label: "70% Dark Truffle", color: "#3C2A21", dark: "#1A120B", price: 50 },
      { id: "pistachio", label: "Roasted Pistachio", color: "#D2E9AF", dark: "#95BB72", price: 80 },
      { id: "velvet", label: "Royal Red Velvet", color: "#841010", dark: "#4B0000", price: 60 },
    ],
    frosting: [
      { id: "butter", label: "Chantilly Cream", color: "#FFFBF2", price: 0 },
      { id: "ganache", label: "Velvet Ganache", color: "#2D2424", price: 40 },
      { id: "ombre", label: "Dusty Rose Blush", color: "#F8C4B4", price: 70 },
    ],
    decor: [
      { id: "minimal", label: "Naked Finish", price: 0 },
      { id: "gold", label: "Edible Gold Leaf", price: 100 },
      { id: "floral", label: "Pressed Wildflowers", price: 150 },
    ]
  }
};

const CustomCakeBuilder = () => {
  const navigate = useNavigate();
  const captureRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [selections, setSelections] = useState({
    size: STUDIO_CONFIG.options.size[1],
    flavor: STUDIO_CONFIG.options.flavor[0],
    frosting: STUDIO_CONFIG.options.frosting[0],
    decor: STUDIO_CONFIG.options.decor[0],
    inscription: ""
  });

  const totalPrice = useMemo(() => {
    return selections.size.price + selections.flavor.price + selections.frosting.price + selections.decor.price;
  }, [selections]);

  const handleFinalize = async () => {
    setLoading(true);
    let imgUri = "";
    
    if (captureRef.current) {
      try {
        const canvas = await html2canvas(captureRef.current, { 
          scale: 2, 
          backgroundColor: null,
          useCORS: true 
        });
        imgUri = canvas.toDataURL("image/png");
      } catch (err) { console.error("Capture failed", err); }
    }

    const orderPayload = {
      cartId: `custom-${Date.now()}`,
      name: `Bespoke ${selections.flavor.label} Cake`,
      price: totalPrice,
      image: imgUri || "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      quantity: 1,
      category: "Cakes",
      selectedWeight: selections.size.weight,
      description: selections.inscription || "Hand-crafted Designer Cake",
      isCustom: true
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || "[]");
    localStorage.setItem('cart', JSON.stringify([...existingCart, orderPayload]));
    window.dispatchEvent(new Event("storage"));

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo?._id) {
        await axios.post("http://localhost:5000/api/cart/add", { userId: userInfo._id, item: orderPayload });
      }
    } catch (err) { console.warn("Cloud sync skipped."); }

    setTimeout(() => {
      setLoading(false);
      navigate('/cart');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F3EB] font-sans flex flex-col overflow-x-hidden pt-10">
      
      {/* --- MAIN BUILDER --- */}
      <main className="flex-1 flex flex-col lg:flex-row">
        
        {/* PREVIEW AREA */}
        <section className="relative flex-1 flex items-center justify-center min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-[18vw] font-serif text-[#EAE3D5] select-none opacity-60 leading-none">Atelier</h1>
          </div>
          
          <motion.div 
            ref={captureRef} 
            animate={{ rotateY: STUDIO_CONFIG.steps[activeStep].tilt }} 
            style={{ perspective: '1000px' }}
            className="relative z-10 p-20"
          >
            <CakeModel selections={selections} />
          </motion.div>
        </section>

        {/* CONTROLS PANEL */}
        <aside className="w-full lg:w-[480px] bg-white lg:rounded-tl-[60px] shadow-2xl flex flex-col z-20">
          <div className="p-8 lg:p-12 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C68B59] font-bold">Step 0{activeStep + 1}</span>
                  <h2 className="text-3xl font-serif text-[#4A3F35]">{STUDIO_CONFIG.steps[activeStep].label}</h2>
                </div>
                <button onClick={() => window.location.reload()} className="p-2 text-[#4A3F35]/20 hover:text-[#4A3F35]">
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {STUDIO_CONFIG.options[STUDIO_CONFIG.steps[activeStep].id].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setSelections({...selections, [STUDIO_CONFIG.steps[activeStep].id]: opt})}
                    className={`w-full flex items-center justify-between p-5 rounded-[24px] border transition-all duration-300 ${selections[STUDIO_CONFIG.steps[activeStep].id].id === opt.id ? "bg-[#C68B59] border-[#C68B59] text-white shadow-lg -translate-y-1" : "bg-white border-[#F0EBE3] text-[#4A3F35] hover:border-[#C68B59]/40"}`}
                  >
                    <div className="flex items-center gap-4">
                      {opt.color ? 
                        <div className="w-6 h-6 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: opt.color }} /> :
                        <div className={`w-1.5 h-1.5 rounded-full ${selections[STUDIO_CONFIG.steps[activeStep].id].id === opt.id ? 'bg-white' : 'bg-[#C68B59]'}`} />
                      }
                      <div className="text-left">
                        <p className="text-sm font-bold tracking-tight">{opt.label}</p>
                        {opt.weight && <p className={`text-[10px] ${selections[STUDIO_CONFIG.steps[activeStep].id].id === opt.id ? 'text-white/70' : 'text-stone-400'}`}>{opt.weight}</p>}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold">{opt.price === 0 ? "Incl." : `+₹${opt.price}`}</span>
                  </button>
                ))}
              </div>

              {activeStep === 3 && (
                <div className="mt-8">
                  <label className="text-[10px] text-[#C68B59] uppercase font-bold tracking-widest mb-2 block">Inscription</label>
                  <input 
                    type="text" 
                    maxLength={15}
                    placeholder="HAPPY BIRTHDAY" 
                    className="w-full bg-[#F7F3EB] border-none rounded-2xl px-6 py-4 text-sm font-serif italic outline-none text-[#4A3F35]"
                    value={selections.inscription}
                    onChange={(e) => setSelections({...selections, inscription: e.target.value})}
                  />
                </div>
              )}
          </div>

          <div className="p-8 lg:p-12 pt-0 bg-white">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xs font-bold text-stone-400">Current Total</span>
              <span className="text-2xl font-serif text-[#4A3F35]">₹{totalPrice}</span>
            </div>
            <button 
              onClick={activeStep === 3 ? handleFinalize : () => setActiveStep(activeStep + 1)}
              disabled={loading}
              className="w-full bg-[#2D2424] text-white py-5 rounded-[22px] font-bold uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#C68B59] transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>{activeStep === 3 ? "Add to Bag" : "Continue"} <ChevronRight size={16} /></>}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

// --- CAKE VISUALIZER (Fixed Blur & Improved Gradients) ---
const CakeModel = ({ selections }) => (
    <div className="relative flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
         <AnimatePresence mode="popLayout">
           {[...Array(selections.size.tiers)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative" 
                style={{ 
                  zIndex: 10 - i, 
                  marginTop: i === 0 ? 0 : '-50px',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' 
                }}
              >
                  <div 
                      className="rounded-t-[45%] rounded-b-[15%] transition-all duration-700" 
                      style={{ 
                          width: `${(220 - i * 45) * selections.size.scale}px`, 
                          height: `${100 * selections.size.scale}px`,
                          background: `linear-gradient(to right, ${selections.frosting.color}, ${selections.flavor.dark} 50%, ${selections.frosting.color} 100%)`,
                          borderLeft: '1px solid rgba(255,255,255,0.2)',
                          borderRight: '1px solid rgba(0,0,0,0.1)',
                      }} 
                  >
                    <div 
                      className="absolute -top-[25px] left-0 w-full h-[55px] rounded-[100%] transition-all duration-700 shadow-inner" 
                      style={{ 
                        background: `radial-gradient(circle at 35% 35%, white, ${selections.frosting.color} 80%)`,
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      {i === 0 && selections.inscription && (
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <span className="text-[9px] font-serif italic text-[#4A3F35]/60 tracking-widest text-center uppercase leading-tight select-none transform -rotate-1">
                            {selections.inscription}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
              </motion.div>
           ))}
         </AnimatePresence>
         
         <div className="absolute bottom-[-35px] flex flex-col items-center -z-10">
            <div className="w-[300px] h-[14px] bg-[#4A3F35] rounded-full shadow-2xl" />
            <div className="w-[90px] h-[35px] bg-[#2D2424]" style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }} />
         </div>
    </div>
);

export default CustomCakeBuilder;