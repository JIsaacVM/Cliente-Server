const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const makeToken = (user) =>
  jwt.sign(
    { id: user._id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );

/** Registro 1: estatus = 'Activo' por default */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let { nombre, correo, usuario, password } = req.body;

    correo  = String(correo  || '').trim().toLowerCase();
    usuario = String(usuario || '').trim().toLowerCase();

    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) return res.status(409).json({ message: 'Correo o usuario ya registrado' });

    const user = await User.create({ nombre, correo, usuario, password, rol: 1, estatus: 'Activo' });
    return res.status(201).json({ id: user._id, nombre: user.nombre, rol: user.rol, estatus: user.estatus });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};

/** Registro 2: el cliente elige el estatus ('Activo' | 'Inactivo') */
const registerWithStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let { nombre, correo, usuario, password, estatus } = req.body;

    correo  = String(correo  || '').trim().toLowerCase();
    usuario = String(usuario || '').trim().toLowerCase();
    estatus = String(estatus || '').trim();

    const allowed = ['Activo', 'Inactivo'];
    if (!allowed.includes(estatus)) {
      return res.status(400).json({ message: "estatus inválido. Use 'Activo' o 'Inactivo'." });
    }

    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) return res.status(409).json({ message: 'Correo o usuario ya registrado' });

    const user = await User.create({ nombre, correo, usuario, password, rol: 1, estatus });
    return res.status(201).json({ id: user._id, nombre: user.nombre, rol: user.rol, estatus: user.estatus });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { usuario, password } = req.body;
    const loginId = String(usuario || '').trim().toLowerCase();

    const user = await User.findOne({ $or: [{ usuario: loginId }, { correo: loginId }] });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    if (String(user.password) !== String(password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = makeToken(user);
    return res.json({ token, user: { id: user._id, nombre: user.nombre, rol: user.rol } });
  } catch (e) {
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

    if (correo  !== undefined) correo  = String(correo ).trim().toLowerCase();
    if (usuario !== undefined) usuario = String(usuario).trim().toLowerCase();

    if (estatus !== undefined) {
      const allowed = ['Activo', 'Inactivo'];
      if (!allowed.includes(String(estatus))) {
        return res.status(400).json({ message: "estatus inválido. Use 'Activo' o 'Inactivo'." });
      }
    }

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

module.exports = { register, registerWithStatus, login, list, update };
