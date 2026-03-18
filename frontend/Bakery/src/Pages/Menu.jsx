import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
// Assuming ProductCard is in your components folder
import ProductCard from "../components/ProductCard"; 

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://bake-end-bakery-drnf.vercel.app/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-[#C2A382] animate-spin" size={40} />
        <h1 className="text-[#4A3728] font-serif text-2xl italic">Preparing the Boutique...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#4A3728] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:text-left"
        >
          <span className="text-[#C2A382] font-mono tracking-[0.3em] uppercase text-[10px] md:text-xs font-black block mb-4">
            Handcrafted Daily
          </span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold leading-none">
            The <span className="text-[#C2A382] italic font-light">Menu.</span>
          </h1>
        </motion.div>

        {/* --- SEARCH BAR --- */}
        <div className="relative max-w-2xl mb-16">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C2A382]">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="SEARCH OUR ARTISAN TREATS..."
            className="w-full bg-white border border-[#C2A382]/20 rounded-2xl py-5 pl-16 pr-6 text-[#4A3728] font-bold text-xs tracking-widest placeholder:text-[#5F5248]/40 outline-none focus:border-[#4A3728] transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* --- PRODUCTS GRID --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                layout
                key={product.id || product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* --- NO RESULTS STATE --- */}
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-32 border-2 border-dashed border-[#C2A382]/20 rounded-[3rem]"
          >
            <p className="text-[#5F5248] text-xl font-serif italic">
              "No crumbs found matching your search."
            </p>
            <button 
              onClick={() => setSearch("")}
              className="mt-6 text-[#C2A382] font-black uppercase tracking-widest text-[10px] border-b-2 border-[#C2A382] pb-1 hover:text-[#4A3728] hover:border-[#4A3728] transition-all"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;