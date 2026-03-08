import mongoose from 'mongoose';

// ---- USER SCHEMA ----
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  usertype: { type: String, default: 'user' }, // 'user' or 'admin'
});

// ---- ADMIN SCHEMA ----
const adminSchema = new mongoose.Schema({
  banner:     { type: String },
  categories: { type: Array },
});

// ---- PRODUCT SCHEMA ----
const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  mainImg:     { type: String },
  carousel:    { type: Array },
  sizes:       { type: Array },
  category:    { type: String },
  gender:      { type: String },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
});

// ---- ORDER SCHEMA ----
const orderSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  name:          { type: String },
  email:         { type: String },
  mobile:        { type: String },
  address:       { type: String },
  pincode:       { type: String },
  title:         { type: String },
  description:   { type: String },
  mainImg:       { type: String },
  size:          { type: String },
  quantity:      { type: Number },
  price:         { type: Number },
  discount:      { type: Number },
  paymentMethod: { type: String },
  orderDate:     { type: String },
  deliveryDate:  { type: String },
  orderStatus:   { type: String, default: 'order placed' },
});

// ---- CART SCHEMA ----
const cartSchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  title:       { type: String },
  description: { type: String },
  mainImg:     { type: String },
  size:        { type: String },
  quantity:    { type: String },
  price:       { type: Number },
  discount:    { type: Number },
});

// ---- EXPORTS ----
export const User    = mongoose.model('users',    userSchema);
export const Admin   = mongoose.model('admin',    adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders  = mongoose.model('orders',   orderSchema);
export const Cart    = mongoose.model('cart',     cartSchema);