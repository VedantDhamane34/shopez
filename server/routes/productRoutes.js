import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, addProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;