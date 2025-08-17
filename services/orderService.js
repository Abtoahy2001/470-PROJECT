const Order = require('../models/Order');

class OrderService {
  async createOrder(orderData) {
    return await Order.create(orderData);
  }

  async getOrderById(id) {
    return await Order.findById(id).populate('items.product_id');
  }

  async getUserOrders(userId) {
    return await Order.find({ user_id: userId }).sort({ created_at: -1 });
  }

  async updateOrderStatus(id, status) {
    return await Order.findByIdAndUpdate(
      id,
      { order_status: status },
      { new: true }
    );
  }
}

module.exports = new OrderService();