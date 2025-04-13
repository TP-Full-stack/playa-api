const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");

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

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Verificar si el usuario existe
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: "No existe usuario con ese email",
      });
    }

    // Generar token de reset (válido por 10 minutos)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Guardar token hasheado en la base de datos con expiración
    usuario.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    usuario.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos

    await usuario.save();

    // Crear URL de reset
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const resetUrl2 = `http://localhost:3001/reset-password/${resetToken}`;

    // Crear mensaje de email
    const mensaje = `Has solicitado restablecer tu contraseña. Por favor haz clic en el siguiente enlace para completar el proceso: \n\n ${resetUrl2} \n\n Este enlace es válido por 10 minutos. Si no solicitaste este cambio, por favor ignora este email.`;

    // Enviar email usando Resend
    await resend.emails.send({
      from: `noreply@ratoneando.site`,
      to: usuario.email,
      subject: "Restablecimiento de contraseña",
      text: mensaje,
    });

    res.status(200).json({
      success: true,
      mensaje: "Email de recuperación enviado",
    });
  } catch (error) {
    // Si hay un error, limpiamos los campos de reset
    const usuario = await User.findOne({ email: req.body.email });
    if (usuario) {
      usuario.resetPasswordToken = undefined;
      usuario.resetPasswordExpire = undefined;
      await usuario.save();
    }

    res.status(500).json({
      success: false,
      mensaje: "Error al enviar el email de recuperación",
      error: error.message,
    });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Obtener token hasheado
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Buscar usuario con token válido
    const usuario = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({
        success: false,
        mensaje: "Token inválido o expirado",
      });
    }

    usuario.password = req.body.password;

    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpire = undefined;

    await usuario.save();

    // Generar nuevo token JWT para auto-login
    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      mensaje: "Contraseña actualizada correctamente",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al restablecer la contraseña",
      error: error.message,
    });
  }
};
