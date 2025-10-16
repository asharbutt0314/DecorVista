import express from 'express';
import { authenticateAdmin } from '../middleware/auth.mjs';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByRoom
} from '../Controllers/productController.mjs';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/room/:room', getProductsByRoom);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', async (req, res) => {
  try {
    const Product = (await import('../Models/Product.mjs')).default;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const Product = (await import('../Models/Product.mjs')).default;
    
    // Only update provided fields
    const updateData = {};
    if (req.body.productname) updateData.productname = req.body.productname;
    if (req.body.brand) updateData.brand = req.body.brand;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.image) updateData.image = req.body.image;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, lean: true }
    );
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const Product = (await import('../Models/Product.mjs')).default;
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;