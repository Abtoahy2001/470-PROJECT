const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

router.post('/:productId', wishlistController.addToWishlist);
router.get('/', wishlistController.getUserWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.get('/check/:productId', wishlistController.checkInWishlist);

module.exports = router;