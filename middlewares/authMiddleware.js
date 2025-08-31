const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }

    const decoded = verifyToken(token);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
      return;
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};