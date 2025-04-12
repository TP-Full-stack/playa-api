const Booking = require("../../../models/Booking");
const Product = require("../../../models/Products");
const User = require("../../../models/User");

/**
 * @desc    Crear una nueva reserva
 * @route   POST /api/bookings
 */
exports.createBooking = async (req, res, next) => {
  try {
    const {
      cliente,
      productos,
      fecha_inicio,
      fecha_fin,
      seguridad_incluida,
      dispositivos_seguridad_seleccionados,
    } = req.body;

    // Verificar que el cliente existe
    const clienteExiste = await User.findById(cliente);
    if (!clienteExiste) {
      return res.status(404).json({
        success: false,
        error: "Cliente no encontrado",
      });
    }

    // Verificar que todos los productos existen y obtener sus detalles
    const productosDetalles = [];
    for (const item of productos) {
      const producto = await Product.findById(item.producto);
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: `Producto con ID ${item.producto} no encontrado`,
        });
      }

      // Verificar que la cantidad no exceda la capacidad máxima
      if (item.cantidad > producto.capacidad_maxima) {
        return res.status(400).json({
          success: false,
          error: `La cantidad solicitada (${item.cantidad}) excede la capacidad máxima (${producto.capacidad_maxima}) para el producto ${producto.nombre}`,
        });
      }

      productosDetalles.push({
        producto,
        cantidad: item.cantidad,
      });
    }

    // Crear nueva reserva
    const booking = new Booking({
      cliente,
      productos,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
      seguridad_incluida,
      dispositivos_seguridad_seleccionados:
        dispositivos_seguridad_seleccionados || [],
    });

    // Calcular precio total
    booking.productos = productosDetalles.map((item) => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
    }));

    // Poblar los productos para el cálculo
    await booking.populate("productos.producto");
    await booking.actualizarPrecioTotal();

    // Guardar la reserva
    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear la reserva",
      message: error.message,
    });
  }
};

/**
 * @desc    Obtener todas las reservas
 * @route   GET /api/bookings
 */
exports.getBookings = async (req, res, next) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.user || !req.user._id) {
      console.log(req.user);
      return res.status(401).json({
        success: false,
        error: "No autorizado",
        message: "Debe iniciar sesión para ver sus reservas",
      });
    }

    // Crear objeto de filtros basado en el ID del usuario
    const filtros = {
      cliente: req.user._id, // Filtrar reservas por el ID del usuario autenticado
    };

    // Ejecutar consulta con populate para obtener detalles completos
    const bookings = await Booking.find(filtros)
      .populate("cliente", "nombre email")
      .populate("productos.producto", "nombre tipo precio_por_turno")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las reservas",
      message: error.message,
    });
  }
};

/**
 * @desc    Eliminar una reserva
 * @route   DELETE /api/bookings/:id
 */
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Reserva no encontrada",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar la reserva",
      message: error.message,
    });
  }
};
