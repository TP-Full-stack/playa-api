const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
