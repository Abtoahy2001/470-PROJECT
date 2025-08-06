const Product = require('../models/Product');

class ProductService {
  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  async getAllProducts(filter = {}) {
    return await Product.find(filter).sort({ created_at: -1 });
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getProductsByCategory(categoryId) {
    return await Product.find({ category_id: categoryId });
  }

  async searchProducts(query) {
    return await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
  }
}

module.exports = new ProductService();