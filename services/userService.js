const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/jwt');

class UserService {
  async createUser(userData) {
    const user = await User.create(userData);
    return user;
  }

  async findUserByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async comparePasswords(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  async getAllUsers() {
    return await User.find().select('-password');
  }

  async getUserById(id) {
    return await User.findById(id).select('-password');
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();