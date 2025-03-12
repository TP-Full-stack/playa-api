const jwt = require("jsonwebtoken");
const User = require("../../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Obtener token del header
    token = req.headers.authorization.split(" ")[1];
  }

  // Verificar que exista el token
  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: "No tienes autorización para acceder a este recurso",
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Asignar usuario al request
    req.User = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      mensaje: "Token inválido",
    });
  }
};
