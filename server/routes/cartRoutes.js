import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes are private
router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:id', authMiddleware, updateCartItem);
router.delete('/clear', authMiddleware, clearCart);
router.delete('/:id', authMiddleware, removeFromCart);

export default router;