module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to perform this action'
    });
    return;
  }
  next();
};