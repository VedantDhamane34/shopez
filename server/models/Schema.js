import mongoose from 'mongoose';
const { Schema } = mongoose;

// ---- USER ----
const userSchema = new Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, default: 'user' }, // 'user' or 'admin'
  phone:     { type: String },
  address:   { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ---- CATEGORY ----
const categorySchema = new Schema({
  categoryName: { type: String, required: true }
});

// ---- PRODUCT ----
const productSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  categoryId:  { type: Schema.Types.ObjectId, ref: 'Category' },
  rating:      { type: Number, default: 0 },
  imageURL:    { type: String },
  createdAt:   { type: Date, default: Date.now }
});

// ---- CART ----
const cartSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true, default: 1 }
});

// ---- ORDER ----
const orderSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice:    { type: Number, required: true },
  orderStatus:   { type: String, default: 'order placed' },
  paymentStatus: { type: String, default: 'pending' },
  orderDate:     { type: Date, default: Date.now }
});

// ---- ORDER ITEM ----
const orderItemSchema = new Schema({
  orderId:   { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating:    { type: Number },
  comment:   { type: String },
  createdAt: { type: Date, default: Date.now }
});

// ---- PAYMENT ----
const paymentSchema = new Schema({
  orderId:       { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  paymentMethod: { type: String },
  paymentStatus: { type: String },
  paymentDate:   { type: Date },
  transactionId: { type: String }
});

// ---- EXPORTS ----
export const User      = mongoose.model('User',      userSchema);
export const Category  = mongoose.model('Category',  categorySchema);
export const Product   = mongoose.model('Product',   productSchema);
export const Cart      = mongoose.model('Cart',      cartSchema);
export const Order     = mongoose.model('Order',     orderSchema);
export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
export const Payment   = mongoose.model('Payment',   paymentSchema);