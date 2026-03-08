import { User, Admin, Orders, Product } from '../models/Schema.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin data (banner, categories)
// @route   GET /api/admin/data
// @access  Private/Admin
const getAdminData = async (req, res) => {
  try {
    const adminData = await Admin.findOne({});
    res.json(adminData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin banner or categories
// @route   PUT /api/admin/data
// @access  Private/Admin
const updateAdminData = async (req, res) => {
  try {
    let adminData = await Admin.findOne({});

    if (!adminData) {
      adminData = await Admin.create(req.body);
    } else {
      adminData.banner = req.body.banner || adminData.banner;
      adminData.categories = req.body.categories || adminData.categories;
      await adminData.save();
    }

    res.json(adminData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Orders.countDocuments();
    const pendingOrders = await Orders.countDocuments({ orderStatus: 'order placed' });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, deleteUser, getAdminData, updateAdminData, getDashboardStats };