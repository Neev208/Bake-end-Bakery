import express from 'express';
import Cart from '../models/cart.js';

const router = express.Router();

// GET user cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD item to cart (or create new cart)
router.post('/add', async (req, res) => {
  const { userId, item } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items.push(item);
      await cart.save();
    } else {
      cart = await Cart.create({ userId, items: [item] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE specific item from cart
router.delete('/:userId/item/:cartId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.cartId != req.params.cartId);
      await cart.save();
      res.status(200).json({ message: "Item removed" });
    } else {
      res.status(404).json("Cart not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;