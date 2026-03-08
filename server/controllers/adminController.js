import { User, Product, Order, Category } from '../models/Schema.js';

// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders   = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'order placed' });
    res.json({ totalUsers, totalProducts, totalOrders, pendingOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/categories
const addCategory = async (req, res) => {
  try {
    const category = await Category.create({ categoryName: req.body.categoryName });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDashboardStats, getAllUsers, deleteUser, getAllCategories, addCategory, deleteCategory };