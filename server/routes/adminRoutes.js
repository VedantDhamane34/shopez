import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAdminData,
  updateAdminData,
  getDashboardStats,
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
router.get('/data', authMiddleware, adminMiddleware, getAdminData);
router.put('/data', authMiddleware, adminMiddleware, updateAdminData);
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

export default router;