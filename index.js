const express = require("express");
const cors = require("cors");
const connectDB = require("../playa-api/src/config/config");
require("dotenv").config();

// Inicializar app
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
