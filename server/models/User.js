const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre:  { type: String, required: true, trim: true, maxlength: 120 },
  correo:  { type: String, required: true, unique: true, lowercase: true, maxlength: 120 },
  usuario: { type: String, required: true, unique: true, lowercase: true, maxlength: 120 },
  password:{ type: String, required: true, minlength: 8, select: true }, // dejamos visible para comparación directa
  estatus: { type: String, enum: ['Activo','Inactivo'], default: 'Activo' },
  rol:     { type: Number, enum: [1,2], default: 1 }
}, { timestamps: true });



module.exports = mongoose.model('Usuario', UserSchema, 'usuario');