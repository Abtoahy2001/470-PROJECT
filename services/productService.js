const Product = require('../models/Product');

class ProductService {
  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  async getAllProducts() {
    return await Product.find({is_active:true}).sort({ created_at: -1 });
  }

  async getProductById(id) {
    return await Product.findById(id).where({is_active:true});
  }

  async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).where({is_active:true});
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getProductsByCategory(categoryId) {
    return await Product.find({ category_id: categoryId }).where({is_active:true});
  }

  async searchProducts(query) {
    return await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).where({is_active:true});
  }

  async sortProducts(order="name"){
    let products;
    if (order === 'name') {
      products = await Product.find().sort({ name: 1 }).where({is_active:true});
    } else if (order === 'price_asc') {
      products = await Product.find().sort({ price: 1 }).where({is_active:true});
      products = products.sort((a, b) => a.price - b.price);
      console.log(products);
    } else if (order === 'price_desc') {
      products = await Product.find().sort({ price: -1 }).where({is_active:true});
      products = products.sort((a, b) => b.price - a.price);
    } else if (order === 'newest') {
      products = await Product.find().sort({ created_at: -1 }).where({is_active:true});
    }
    return products;

  }
}

module.exports = new ProductService();