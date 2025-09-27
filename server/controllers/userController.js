const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const makeToken = (user) =>
  jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre, correo, usuario, password } = req.body;

    const exists = await User.findOne({ $or: [{ correo }, { usuario }] });
    if (exists) return res.status(409).json({ message: 'Correo o usuario ya registrado' });

    const user = await User.create({ nombre, correo, usuario, password, rol: 1 });
    return res.status(201).json({ id: user._id, nombre: user.nombre, rol: user.rol });
  } catch (e) {
    return res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { usuario, password } = req.body; // usuario puede ser username o correo
    const user = await User.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

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
    const { nombre, correo, usuario, password, estatus, rol } = req.body;

    const data = { nombre, correo, usuario, estatus, rol };
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    Object.assign(user, data);
    if (password) user.password = password; // se re-hasheará con pre('save')
    await user.save();

    return res.json({ id: user._id, nombre: user.nombre, rol: user.rol, estatus: user.estatus });
  } catch (e) {
    return res.status(500).json({ message: 'Error al actualizar', error: e.message });
  }
};

module.exports = { register, login, list, update };
