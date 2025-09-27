const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de .env

const app = express();

// Middlewares
app.use(cors()); // Permite la comunicación entre dominios
app.use(express.json()); // Permite al servidor entender JSON

// Rutas
app.use('/api/tasks', require('./routes/tasks'));

app.use('/api/users', require('./routes/users'));

// Conexión a la base de datos
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB conectado exitosamente 👍"))
    .catch(err => console.error("Error al conectar con MongoDB:", err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API del servidor de tareas está funcionando!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} 🚀`);
});