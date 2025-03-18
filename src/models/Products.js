const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    trim: true,
  },
  tipo: {
    type: String,
    required: [true, "El tipo de producto es obligatorio"],
    trim: true,
  },
  precio_por_turno: {
    type: Number,
    required: [true, "El precio por turno es obligatorio"],
    min: [0, "El precio debe ser un valor positivo"],
  },
  requiere_seguridad: {
    type: Boolean,
    default: false,
  },
  dispositivos_seguridad: {
    type: [String],
    default: [],
  },
  capacidad_maxima: {
    type: Number,
    required: [true, "La capacidad máxima es obligatoria"],
    min: [1, "La capacidad máxima debe ser al menos 1"],
  },
  descripcion: {
    type: String,
    trim: true,
  },
});

const ProductSchema = mongoose.model("Product", schema);
module.exports = ProductSchema;
