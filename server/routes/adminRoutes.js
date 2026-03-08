import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllCategories,
  addCategory,
  deleteCategory
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats',          authMiddleware, adminMiddleware, getDashboardStats);
router.get('/users',          authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id',   authMiddleware, adminMiddleware, deleteUser);
router.get('/categories',     authMiddleware, adminMiddleware, getAllCategories);
router.post('/categories',    authMiddleware, adminMiddleware, addCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;