const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El cliente es obligatorio"],
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "El producto es obligatorio"],
      },
      cantidad: {
        type: Number,
        required: [true, "La cantidad es obligatoria"],
        min: [1, "La cantidad debe ser al menos 1"],
      },
    },
  ],
  fecha_inicio: {
    type: Date,
    required: [true, "La fecha de inicio es obligatoria"],
  },
  fecha_fin: {
    type: Date,
    required: [true, "La fecha de fin es obligatoria"],
  },
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "cancelada", "completada"],
    default: "pendiente",
  },
  precio_total: {
    type: Number,
    required: [true, "El precio total es obligatorio"],
  },
  seguridad_incluida: {
    type: Boolean,
    default: false,
  },
  dispositivos_seguridad_seleccionados: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para validar fechas
schema.pre("save", function (next) {
  if (this.fecha_inicio >= this.fecha_fin) {
    const error = new Error(
      "La fecha de inicio debe ser anterior a la fecha de fin"
    );
    return next(error);
  }
  next();
});

// Método para calcular la duración en turnos (días)
schema.methods.calcularDuracion = function () {
  const diffTime = Math.abs(this.fecha_fin - this.fecha_inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Método para actualizar el precio total
schema.methods.actualizarPrecioTotal = async function () {
  let total = 0;

  // Calcular turnos
  const turnos = this.calcularDuracion();

  // Sumar el precio de cada producto por la cantidad y turnos
  for (const item of this.productos) {
    total += item.producto.precio_por_turno * item.cantidad * turnos;
  }

  this.precio_total = total;
  return this.precio_total;
};

const BookingSchema = mongoose.model("Booking", schema);
module.exports = BookingSchema;
