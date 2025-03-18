const Product = require("../../../models/Products");

exports.getProductos = async (req, res) => {
  try {
    const productos = await Product.find();

    return res.status(200).json({
      success: true,
      count: productos.length,
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener los productos",
    });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: "No se encontró el producto",
      });
    }

    return res.status(200).json({
      success: true,
      data: producto,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error al obtener el producto",
    });
  }
};
