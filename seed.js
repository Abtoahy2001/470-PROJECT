// seed-db.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const products = require('./demo.json');

const seedDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://muztahiddurjoy99:XFjGDzngNx7fQayN@cluster0.ciup16t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
    // Clear existing data
    await Product.deleteMany();
    
    // Insert new data
    await Product.insertMany(products);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();