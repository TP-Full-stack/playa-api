const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/config");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes.js");
const dashboardRoutes = require("./src/routes/dashboardRoutes.js");

// Inicializar app
const app = express();

connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<html><body><h1>Playa app API</h1></body></html>");
});

app.use("/api/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
