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
    unique: true,      // evita correos duplicados
    lowercase: true,   // se guarda en minúsculas
    match: [/\S+@\S+\.\S+/, 'Correo inválido'] // valida formato
  },
  contrasenia: {
    type: String,
    required: true,
    minlength: 8       // mínimo de seguridad básico
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
