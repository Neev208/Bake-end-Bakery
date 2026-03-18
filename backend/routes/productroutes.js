import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct 
} from '../controllers/productcontroller.js';

const router = express.Router();

// --- 1. DEBUG LOGGER ---
// This will log every time you try to add a new bakery item
router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`📩 [Bakery Admin] Attempting to add new product: ${req.body.name || 'Unknown'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  }
  next();
});

/**
 * @route   GET /api/products
 * @desc    Get all products (Supports ?cat=CategoryName and ?search=keyword)
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by its MongoDB ID
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin function)
 * @note    IMPORTANT: The logic for notifySubscribersNewItem must be called 
 * inside the createProduct function in your controller.
 */
router.post('/', createProduct);

export default router;