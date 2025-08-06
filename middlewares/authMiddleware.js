const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error('You are not logged in! Please log in to get access');
    }

    const decoded = verifyToken(token);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error('The user belonging to this token no longer exists');
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};