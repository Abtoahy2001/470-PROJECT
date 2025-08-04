const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected for seeding');
}).catch(err => {
  console.error('DB connection error:', err);
});

const products = [
  {
    name: "Phone X",
    description: "Latest smartphone with awesome features",
    price: 999,
    category: "electronics",
    image: "phone.jpg",
    stock: 10
  },
  {
    name: "Running Shoes",
    description: "Comfortable and lightweight shoes",
    price: 120,
    category: "footwear",
    image: "shoes.jpg",
    stock: 20
  }
];

const users = [
  {
    username: "john",
    email: "john@example.com",
    password: "123456",
    role: "customer",
    cart: []
  },
  {
    username: "bizowner",
    email: "biz@example.com",
    password: "123456",
    role: "business",
    cart: []
  }
];

async function seedDB() {
  try {
    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    await User.insertMany(users);

    console.log('Dummy data added');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seedDB();
