const Cart = require('../models/Cart');

class CartService {
  async getCartByUserId(userId) {
    return await Cart.findOne({ user_id: userId }).populate('items.product_id');
  }

  async addToCart(userId, productId, quantity, price) {
    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product_id.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product_id: productId,
        quantity,
        price_at_addition: price
      });
    }

    return await cart.save();
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return null;

    cart.items = cart.items.filter(
      item => item.product_id.toString() !== productId
    );

    return await cart.save();
  }

  async clearCart(userId) {
    return await Cart.findOneAndUpdate(
      { user_id: userId },
      { items: [], total: 0 },
      { new: true }
    );
  }
}

module.exports = new CartService();