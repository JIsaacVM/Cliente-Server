// src/services/usuariosApi.js
import axios from 'axios';
import { getToken } from './authService';

const API_BASE   = import.meta?.env?.VITE_API_URL || 'http://localhost:4001/api';
const USERS_PATH = '/users';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// GET /users (admin)
export async function getUsuarios() {
  const { data } = await api.get(USERS_PATH);
  return data; // array
}

// POST /users/register  (estatus Activo por default en el controller)
export async function crearUsuarioDefaultActivo({ nombre, correo, usuario, password }) {
  const { data } = await axios.post(`${API_BASE}${USERS_PATH}/register`,
    { nombre, correo, usuario, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data; // { id, nombre, rol, estatus }
}

// POST /users/register-with-status (si quisieras crear eligiendo estatus)
export async function crearUsuarioConEstatus({ nombre, correo, usuario, password, estatus }) {
  const { data } = await axios.post(`${API_BASE}${USERS_PATH}/register-with-status`,
    { nombre, correo, usuario, password, estatus },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

// PUT /users/:id (admin) — para actualizar (incluye estatus)
export async function actualizarUsuario(id, payload) {
  const { data } = await api.put(`${USERS_PATH}/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data; // { id, nombre, rol, estatus }
}
