import { Orders } from '../models/Schema.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const {
      name, email, mobile, address, pincode,
      title, description, mainImg, size, quantity,
      price, discount, paymentMethod, orderDate, deliveryDate,
    } = req.body;

    const order = await Orders.create({
      userId: req.user.id,
      name,
      email,
      mobile,
      address,
      pincode,
      title,
      description,
      mainImg,
      size,
      quantity,
      price,
      discount,
      paymentMethod,
      orderDate,
      deliveryDate,
      orderStatus: 'order placed',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders of the logged-in user
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };