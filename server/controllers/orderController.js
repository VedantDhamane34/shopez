import { Order, OrderItem, Payment } from '../models/Schema.js';

// @route POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const {
      totalPrice,
      total,
      paymentMethod,
      items,
      address,
      name,
      email,
      mobile,
      pincode
    } = req.body;

    const finalTotal = totalPrice || total || 0;

    const order = await Order.create({
      userId:        req.user.id,
      totalPrice:    finalTotal,
      orderStatus:   'order placed',
      paymentStatus: 'pending',
      address,
      name,
      email,
      mobile,
      pincode
    });

    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        orderId:   order._id,
        productId: item.productId || item._id,
        rating:    0,
        comment:   ''
      }));
      await OrderItem.insertMany(orderItems);
    }

    await Payment.create({
      orderId:       order._id,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'pending',
      paymentDate:   new Date()
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/orders/:id/status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/orders/:id (Admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };