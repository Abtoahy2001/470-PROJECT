const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Mock user ID for now (replace with actual user authentication later)
const mockUserId = '670b2f3a4f1a2c001c8b4567';  // Replace with an actual user ID for testing

// Add product to cart
router.post('/add', async (req, res) => {
  // Log the incoming request body for debugging
  console.log("Request Body:", req.body);  // Debugging line

  const { productId, quantity, userId } = req.body;  // Destructure the data from the request body
  
  try {
    // If userId is provided in the request, use it instead of the mock user ID
    const userToUse = userId || mockUserId;  // Default to mockUserId if userId is not provided
    console.log("Using User ID:", userToUse);  // Log which user ID is being used

    // Find the user by ID (use actual userId when implemented)
    const user = await User.findById(userToUse);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the product by productId
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product already exists in the user's cart
    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    console.log("Existing cart item:", existingItem);  // Log the existing cart item

    if (existingItem) {
      // If product is already in the cart, update the quantity
      existingItem.quantity += quantity;
      console.log("Updated existing item:", existingItem);
    } else {
      // If product is not in the cart, add it
      user.cart.push({ productId, quantity });
      console.log("Added new item:", { productId, quantity });
    }

    // Save the updated user document with the new cart
    await user.save();
    console.log("Cart updated successfully:", user.cart);  // Log the updated cart

    // Send the updated cart as the response
    res.json({ message: 'Cart updated', cart: user.cart });
  } catch (err) {
    console.error('Error adding to cart:', err);  // Log any errors
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
