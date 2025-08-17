const Category = require('../models/Category');

class CategoryService {
  async createCategory(categoryData) {
    const category = await Category.create(categoryData);
    return category;
  }

  async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  }

  async getCategoryById(id) {
    return await Category.findById(id);
  }

  async updateCategory(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteCategory(id) {
    return await Category.findByIdAndDelete(id);
  }
}

module.exports = new CategoryService();