import { Product, Category } from '../models/Schema.js';

// @route GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('categoryId', 'categoryName');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId', 'categoryName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/category/:categoryId
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/products (Admin)
const addProduct = async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      const products = await Product.insertMany(data);
      return res.status(201).json(products);
    }

    const { name, description, price, stock, categoryId, rating, imageURL } = data;
    const product = await Product.create({
      name, description, price, stock, categoryId, rating, imageURL
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/products/:id (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/products/:id (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllProducts, getProductById, getProductsByCategory, addProduct, updateProduct, deleteProduct };