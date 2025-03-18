const express = require("express");
const { protect } = require("../middleware/(auth)/auth");
const productController = require("../controllers/dashboard/products/productController");
const router = express.Router();

// GET
router.get("/products", productController.getProductos);
router.get("/products/:id", productController.getProductoById);

module.exports = router;
