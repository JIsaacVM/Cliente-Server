import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Puedes añadir estilos básicos aquí

// Definimos la URL base de nuestra API
const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');

  // 1. Cargar las tareas existentes al iniciar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  // 2. Manejar el envío del formulario para crear una nueva tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return; // Evitar tareas vacías

    try {
      const response = await axios.post(API_URL, { text: inputText });
      setTasks([...tasks, response.data]); // Añadir la nueva tarea a la lista
      setInputText(''); // Limpiar el input
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Lista de Tareas (MERN)</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Añade una nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id}>{task.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;