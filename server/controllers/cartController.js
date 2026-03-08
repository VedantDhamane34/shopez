import { Cart } from '../models/Schema.js';

// @desc    Get cart items for logged-in user
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { title, description, mainImg, size, quantity, price, discount } = req.body;

    const cartItem = await Cart.create({
      userId: req.user.id,
      title,
      description,
      mainImg,
      size,
      quantity,
      price,
      discount,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    // Only owner can update
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    cartItem.quantity = req.body.quantity || cartItem.quantity;
    const updated = await cartItem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart for the user
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };