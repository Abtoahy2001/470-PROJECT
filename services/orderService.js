const Order = require('../models/Order');

class OrderService {
  async createOrder(orderData) {
    
    return await Order.create({
      ...orderData,
      subtotal: orderData.items.reduce((acc, item) => acc + (item.price_at_purchase * item.quantity), 0),
      total: orderData.items.reduce((acc, item) => acc + (item.price_at_purchase * item.quantity), 0) + orderData.shipping_fee
    });
  }

  async getOrderById(id) {
    const orderResponse = await Order.findById(id).populate('items.product_id');
    const userData = await orderResponse.populate('user_id', 'fullname email');
    return {user:userData.toObject(),...orderResponse.toObject()};
  }

  async getUserOrders(userId) {
    const orderResponse = await Order.find({ user_id: userId }).populate('user_id', 'fullname email').populate('items.product_id').sort({ created_at: -1 });
    return orderResponse.map(order => order.toObject());
  }

  async updateOrderStatus(id, status) {
    const statusResponse = await Order.findByIdAndUpdate(
      id,
      { order_status: status }
    );
    if (status=="completed") {
      const order = await Order.findById(id);
      order.items.forEach(async (item) => {
        hello
        await item.product_id.updateOne({
          $inc: { stock: -item.quantity }
        });
      }
      );
    }
    return statusResponse;
  }

  async updatePaymentStatus(id, status) {
    const paymentResponse = await Order.findByIdAndUpdate(
      id,
      { payment_status: status }
    );
    
    return paymentResponse;
  }
}

module.exports = new OrderService();