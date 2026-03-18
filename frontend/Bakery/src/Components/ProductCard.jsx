import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-gray-600">₹{product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-full text-sm"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
