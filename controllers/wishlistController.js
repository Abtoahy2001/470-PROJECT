const wishlistService = require('../services/wishlistService');

exports.addToWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await wishlistService.addToWishlist(
      req.user._id,
      req.params.productId
    );
    
    res.status(201).json({
      status: 'success',
      data: {
        wishlistItem
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product already in wishlist'
      });
    }
    next(error);
  }
};

exports.getUserWishlist = async (req, res, next) => {
  try {
    console.log('Fetching wishlist for user:', req.user._id);
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'You must be logged in to view your wishlist'
      });
    }
    console.log('User is authenticated:', req.user);
    const wishlist = await wishlistService.getUserWishlist(req.user._id);
    
    res.status(200).json({
      status: 'success',
      results: wishlist.length,
      data: {
        wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await wishlistService.removeFromWishlist(
      req.user._id,
      req.params.productId
    );
    
    if (!wishlistItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wishlist item not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.checkInWishlist = async (req, res, next) => {
  try {
    const inWishlist = await wishlistService.checkInWishlist(
      req.user._id,
      req.params.productId
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        inWishlist
      }
    });
  } catch (error) {
    next(error);
  }
};