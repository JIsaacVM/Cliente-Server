import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Bienvenido from './pages//Bienvenido/bienvenido.jsx';
import Usuarios from './pages//usuarios/usuarios.jsx';
import { getCurrentUser } from './services/authService.js';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && Number(user.rol) !== 2) return <Navigate to="/bienvenido" replace />;
  return children;
};

const RoleRedirect = () => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return Number(user.rol) === 2 ? <Navigate to="/usuarios" replace /> : <Navigate to="/bienvenido" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/bienvenido"
          element={
            <ProtectedRoute>
              <Bienvenido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requireAdmin>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
