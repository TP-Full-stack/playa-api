const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// Generar token JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Registrar usuario
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: "Email ya registrado",
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      email,
      password,
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: error.message,
    });
  }
};

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: "Por favor ingresa email y contraseña",
      });
    }

    // Verificar si el usuario existe
    const usuario = await User.findOne({ email }).select("+password");
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales inválidas",
      });
    }

    // Verificar si la contraseña coincide
    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        mensaje: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: error.message,
    });
  }
};
