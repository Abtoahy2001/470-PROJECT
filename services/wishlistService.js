const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

class WishlistService {
  async addToWishlist(userId, productId) {
    const wishlistItem = await Wishlist.create({ user: userId, product: productId });
    return wishlistItem;
  }

  async getUserWishlist(userId) {
    return await Wishlist.find({ user: userId }).populate({
      path: 'product',
      select: 'name price image_url'
    });
  }

  async removeFromWishlist(userId, productId) {
    return await Wishlist.findOneAndDelete({ user: userId, product: productId });
  }

  async checkInWishlist(userId, productId) {
    const item = await Wishlist.findOne({ user: userId, product: productId });
    return !!item;
  }
}

module.exports = new WishlistService();