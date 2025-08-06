module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new Error('You do not have permission to perform this action');
  }
  next();
};