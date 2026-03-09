import { Cart } from '../models/Schema.js';

// @route GET /api/cart
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, title, mainImg, price, discount, size, quantity } = req.body;

    const existing = await Cart.findOne({ 
      userId: req.user.id, 
      productId: productId || title 
    });
    
    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(quantity || 1);
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await Cart.create({
      userId:    req.user.id,
      productId: productId || title,
      title,
      mainImg,
      price,
      discount:  discount || 0,
      size,
      quantity:  quantity || 1
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/cart/:id
const updateCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    cartItem.quantity = req.body.quantity || cartItem.quantity;
    const updated = await cartItem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };