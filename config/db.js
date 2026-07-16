const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      socketTimeoutMS: 45000
    });

    console.log("==================================");
    console.log("✅ MongoDB Connected");
    console.log(`📦 Database : ${conn.connection.name}`);
    console.log(`🌍 Host     : ${conn.connection.host}`);
    console.log("==================================");
  } catch (error) {
    console.error("==================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("==================================");
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on("connected", () => {
  console.log("✅ Database connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Database disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed");
  process.exit(0);
});

module.exports = connectDB;