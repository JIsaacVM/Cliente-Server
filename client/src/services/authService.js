// src/services/authService.js
import axios from 'axios';

// === Config base de API ===
const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';
const USERS_BASE = `${API_BASE}/users`; // ajusta si montaste el router en otro path

// === Storage helpers ===
const AUTH_KEY = 'auth'; // { token, user }

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
}

export function storeAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

// === Axios instance con interceptores ===
const api = axios.create({
  baseURL: API_BASE,
  // Puedes setear timeout si quieres: timeout: 12000,
});

// Interceptor: agrega Authorization si hay token
api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// Interceptor: maneja 401 globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Token inválido/expirado → limpiar y (opcional) redirigir
      clearAuth();
      // window.location.href = '/login'; // si quieres redirigir
    }
    return Promise.reject(err);
  }
);

// ====== Auth API ======

// POST /users/login  (backend espera { usuario, password })
export async function login({ usuario, password }) {
  const { data } = await axios.post(`${USERS_BASE}/login`, { usuario, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  // Backend responde: { token, user: { id, nombre, rol } }
  storeAuth(data);
  return data; // { token, user }
}

// POST /users/register (backend espera { nombre, correo, usuario, password })
export async function registerUser({ nombre, correo, usuario, password }) {
  const { data } = await axios.post(`${USERS_BASE}/register`, { nombre, correo, usuario, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data; // { id, nombre, rol }
}

// GET /users (admin only) — requiere token + rol admin en backend
export async function listUsers() {
  const { data } = await api.get('/users'); // usa instancia con Authorization
  return data; // arreglo de usuarios sin password
}

// PUT /users/:id (admin only) — payload opcional: { nombre, correo, usuario, password, estatus, rol }
// OJO: tu validador usa estatus 'Activo' | 'Inactivo' (con mayúscula inicial).
export async function updateUser(id, payload) {
  const { data } = await api.put(`/users/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data; // { id, nombre, rol, estatus }
}

// Cerrar sesión
export function logout() {
  clearAuth();
}

// Helper: obtener usuario actual (según lo guardado tras login)
export function getCurrentUser() {
  return getStoredAuth()?.user || null;
}

// Helper: obtener token actual
export function getToken() {
  return getStoredAuth()?.token || null;
}
