import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private - user routes
router.post('/', authMiddleware, placeOrder);
router.get('/myorders', authMiddleware, getMyOrders);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteOrder);

export default router;