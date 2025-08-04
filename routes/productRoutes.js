const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with optional search & filter
router.get('/', async (req, res) => {
  const { name, category } = req.query;
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
  }

  if (category) {
    filter.category = category;
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET product by ID with related suggestions
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(3);

    res.json({ product, related });
  } catch (err) {
    res.status(500).json({ error: 'Product not found' });
  }
});

module.exports = router;
