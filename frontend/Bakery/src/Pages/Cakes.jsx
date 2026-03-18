import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { productData } from "../data";

const Cakes = () => {
  // Filter for ONLY Cakes
  const products = productData.filter((p) => p.cat === "Cakes");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[#F2CEE6]">
          Signature Cakes
        </h1>
        <p className="text-gray-400 mt-6 text-lg">
          Decadent layers and fresh ingredients for special moments.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative cursor-pointer h-full"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/5 relative">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full font-bold">
                  {product.price}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-start px-2">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-[#F2CEE6] transition-colors">{product.name}</h3>
                </div>
                <div className="p-3 rounded-full border border-white/5 group-hover:border-[#F2CEE6] transition-all bg-white/5">
                  <ArrowUpRight size={20} className="group-hover:text-[#F2CEE6]" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cakes;