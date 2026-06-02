/**
 populates the database with sample products and an admin user. Terminal:  node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 2499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    rating: 4.5,
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.",
  },
  {
    name: "Smartphone 128GB",
    price: 15999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    category: "Electronics",
    rating: 4.3,
    description:
      "Latest smartphone with 128GB storage, 6.5-inch AMOLED display, and 48MP triple camera system.",
  },
  {
    name: "Men's Casual T-Shirt",
    price: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Clothing",
    rating: 4.0,
    description:
      "Comfortable cotton t-shirt available in multiple colours. Perfect for everyday wear.",
  },
  {
    name: "Running Shoes",
    price: 3499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Footwear",
    rating: 4.7,
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
  },
  {
    name: "Laptop Backpack",
    price: 1299,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Accessories",
    rating: 4.2,
    description:
      "Water-resistant laptop backpack with USB charging port and anti-theft design. Fits up to 15.6-inch laptops.",
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 499,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    category: "Home",
    rating: 4.6,
    description:
      "Double-wall insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
  },
  {
    name: "Mechanical Keyboard",
    price: 3999,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    category: "Electronics",
    rating: 4.8,
    description:
      "RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and programmable macros.",
  },
  {
    name: "Denim Jacket",
    price: 1999,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",
    category: "Clothing",
    rating: 4.1,
    description:
      "Classic denim jacket with a modern fit. Features button closure and multiple pockets.",
  },
  {
    name: "Yoga Mat",
    price: 899,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    category: "Sports",
    rating: 4.4,
    description:
      "Non-slip yoga mat with alignment lines. 6mm thick for comfortable support during workouts.",
  },
  {
    name: "Smart Watch",
    price: 4999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Electronics",
    rating: 4.3,
    description:
      "Feature-rich smartwatch with heart rate monitoring, GPS tracking, and 7-day battery life.",
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`👤 Admin user created: admin@example.com / admin123`);

    // Create a regular user
    await User.create({
      name: "Test User",
      email: "user@example.com",
      password: "user123",
      role: "user",
    });
    console.log(`👤 Test user created:  user@example.com / user123`);

    // Insert products
    await Product.insertMany(sampleProducts);
    console.log(`📦 ${sampleProducts.length} sample products inserted`);

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
