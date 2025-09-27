const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  correo: {
    type: String,
    required: true,
    unique: true,       // evita correos duplicados
    lowercase: true,    // se guarda en minúsculas
    match: [/\S+@\S+\.\S+/, 'Correo inválido'] // valida formato
  },
  password: {
    type: String,
    required: true,
    minlength: 8        // mínimo de seguridad básico
  },
  estatus: {
    type: String,
    enum: ['activo', 'inactivo'],  // solo acepta estos valores
    default: 'activo'
  },
  rol: {
    type: Number,
    enum: [1, 2],       // solo acepta 1 o 2
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
