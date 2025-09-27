const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const makeToken = (user) =>
  jwt.sign(
    { id: user._id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let { nombre, correo, usuario, password, estatus } = req.body;

    correo = String(correo || '').trim().toLowerCase();
    usuario = String(usuario || '').trim().toLowerCase();

    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) return res.status(409).json({ message: 'Correo o usuario ya registrado' });

    // 👇 si no viene estatus, Mongoose aplicará el default ("Activo")
    const user = await User.create({ nombre, correo, usuario, password, rol: 1, estatus });

    return res.status(201).json({ 
      id: user._id, 
      nombre: user.nombre, 
      rol: user.rol, 
      estatus: user.estatus  // 👈 ahora lo devuelves
    });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};


const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('[LOGIN ERRORS]', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { usuario, password } = req.body;
    const loginId = String(usuario || '').trim().toLowerCase();

    console.log('[LOGIN BODY RAW]', { usuario, password });

    const user = await User.findOne({
      $or: [{ usuario: loginId }, { correo: loginId }]
    });

    if (!user) {
      console.log('[LOGIN USER?] No se encontró usuario con', loginId);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('[LOGIN USER FOUND]', {
      id: user._id?.toString?.(),
      usuario: user.usuario,
      correo: user.correo,
      storedPassword: user.password
    });

    // ✅ Comparación directa (texto plano)
    if (String(user.password) !== String(password)) {
      console.log('[LOGIN FAILED] password mismatch');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = makeToken(user);
    console.log('[LOGIN SUCCESS]', { id: user._id?.toString?.(), rol: user.rol });

    return res.json({ token, user: { id: user._id, nombre: user.nombre, rol: user.rol } });
  } catch (e) {
    console.error('[LOGIN ERROR]', e);
    return res.status(500).json({ message: 'Error al iniciar sesión', error: e.message });
  }
};

const list = async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ message: 'Error al listar', error: e.message });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    let { nombre, correo, usuario, password, estatus, rol } = req.body;

    if (correo !== undefined) correo = String(correo).trim().toLowerCase();
    if (usuario !== undefined) usuario = String(usuario).trim().toLowerCase();

    const data = { nombre, correo, usuario, estatus, rol };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    Object.assign(user, data);
    if (password !== undefined) user.password = String(password);

    await user.save();

    return res.json({ id: user._id, nombre: user.nombre, rol: user.rol, estatus: user.estatus });
  } catch (e) {
    return res.status(500).json({ message: 'Error al actualizar', error: e.message });
  }
};

module.exports = { register, login, list, update };