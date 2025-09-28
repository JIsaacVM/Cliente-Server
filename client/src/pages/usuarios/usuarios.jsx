import React, { useEffect, useState } from "react";
import { getUsuarios, crearUsuarioDefaultActivo, actualizarUsuario } from "../../services/usuariosApi";

const UserTableCyberpunk = () => {
  const [users, setUsers] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit' | 'update'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form principal para create/edit
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    estatus: "Activo",
    usuario: "",
    password: "",
  });

  // Form de actualización (panel de "Actualizar")
  const [updateForm, setUpdateForm] = useState({
    id: "",
    correo: "",
    usuario: "",
    password: "",
    estatus: "Activo",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsuarios();
      const normalized = (Array.isArray(data) ? data : []).map((u) => ({
        id: u._id || u.id,
        nombre: u.nombre ?? "",
        correo: u.correo ?? "",
        estatus: u.estatus ?? "Activo",
        usuario: u.usuario ?? "",
        rol: u.rol,
      }));
      setUsers(normalized);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // === Panel handlers ===
  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedUser(null);
    setMode("create");
    setFormData({ nombre: "", correo: "", estatus: "Activo", usuario: "", password: "" });
    setUpdateForm({ id: "", correo: "", usuario: "", password: "", estatus: "Activo" });
    setError("");
  };

  // === Registrar ===
  const handleRegister = () => {
    setMode("create");
    setSelectedUser(null);
    setFormData({ nombre: "", correo: "", estatus: "Activo", usuario: "", password: "" });
    openPanel();
  };

  // === Editar por fila ===
  const handleEdit = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre || "",
      correo: user.correo || "",
      estatus: user.estatus || "Activo",
      usuario: user.usuario || "",
      password: "",
    });
    openPanel();
  };

  // === Actualizar masivo (abre formulario de selección) ===
  const handleOpenUpdatePanel = () => {
    setMode("update");
    // Resetea el formulario de actualización
    setUpdateForm({ id: "", correo: "", usuario: "", password: "", estatus: "Activo" });
    openPanel();
  };

  // === Cambios en inputs ===
  const onChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onChangeUpd = (e) => setUpdateForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Cuando eliges un usuario en el select del modo "update"
  const onSelectUserToUpdate = (e) => {
    const id = e.target.value;
    const u = users.find((x) => x.id === id);
    if (!u) {
      setUpdateForm({ id: "", correo: "", usuario: "", password: "", estatus: "Activo" });
      return;
    }
    setUpdateForm({
      id: u.id,
      correo: u.correo,
      usuario: u.usuario || "",
      password: "",
      estatus: u.estatus || "Activo",
    });
  };

  // === Submit del panel (las 3 variantes) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (mode === "create") {
        // POST /users/register (estatus Activo por default en backend)
        await crearUsuarioDefaultActivo({
          nombre: formData.nombre,
          correo: formData.correo,
          usuario: formData.usuario,
          password: formData.password,
        });
      } else if (mode === "edit" && selectedUser) {
        // PUT /users/:id  (permite cambiar estatus; correo/nombre también)
        const payload = {
          nombre: formData.nombre,
          correo: formData.correo,
          estatus: formData.estatus,
          // Si quieres permitir cambiar usuario o password en EDITAR por fila, descomenta:
          // usuario: formData.usuario || undefined,
          // password: formData.password || undefined,
        };
        await actualizarUsuario(selectedUser.id, payload);
      } else if (mode === "update") {
        if (!updateForm.id) {
          setError("Selecciona un usuario a actualizar.");
          setSaving(false);
          return;
        }
        // PUT /users/:id — correo solo lectura (no lo mandamos), actualizamos usuario/password/estatus
        const payload = {
          usuario: updateForm.usuario || undefined,
          password: updateForm.password || undefined, // si va vacío, no lo mandamos
          estatus: updateForm.estatus,
        };
        // elimina keys undefined para no ensuciar
        Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
        await actualizarUsuario(updateForm.id, payload);
      }

      await cargar(); // refresca la tabla desde BD
      closePanel();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-container">
      <div className="cyber-container table-container">
        <h1 className="form-title">// USER_DATABASE //</h1>

        <div className="header-actions" style={{ display: "flex", gap: 8 }}>
          <button className="neon-button register-btn" onClick={handleRegister}>
            Registrar
          </button>
          <button className="neon-button" onClick={handleOpenUpdatePanel}>
            Actualizar
          </button>
        </div>

        {loading && <p style={{ color: "#e0e0e0" }}>Cargando usuarios...</p>}
        {error && !isPanelOpen && <p style={{ color: "#f803f8" }}>{error}</p>}

        <div className="table-wrapper">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Estatus</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan="4" style={{ color: "#999", textAlign: "center" }}>
                    Sin usuarios para mostrar
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>
                      <span className={`status-pill ${String(user.estatus || "").toLowerCase()}`}>{user.estatus}</span>
                    </td>
                    <td>
                      <button className="action-button" onClick={() => handleEdit(user)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel lateral (Create/Edit/Update) */}
      <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
        <h2 className="panel-title">
          {mode === "create" && "// REGISTER_USER //"}
          {mode === "edit" && "// EDIT_USER //"}
          {mode === "update" && "// UPDATE_USER //"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* === CREATE === */}
          {mode === "create" && (
            <>
              <div className="input-group">
                <label className="neon-label">{"> Nombre"}</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={onChange} className="glitch-input" required />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Correo"}</label>
                <input type="email" name="correo" value={formData.correo} onChange={onChange} className="glitch-input" required />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Usuario"}</label>
                <input type="text" name="usuario" value={formData.usuario} onChange={onChange} className="glitch-input" required />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Contraseña"}</label>
                <input type="password" name="password" value={formData.password} onChange={onChange} className="glitch-input" minLength={8} required />
              </div>
            </>
          )}

          {/* === EDIT (por fila) === */}
          {mode === "edit" && (
            <>
              <div className="input-group">
                <label className="neon-label">{"> Nombre"}</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={onChange} className="glitch-input" required />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Correo"}</label>
                <input type="email" name="correo" value={formData.correo} onChange={onChange} className="glitch-input" required />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Estatus"}</label>
                <select name="estatus" value={formData.estatus} onChange={onChange} className="glitch-input">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              {/* Si quieres también permitir cambiar usuario/password aquí, descomenta:
              <div className="input-group">
                <label className="neon-label">{"> Usuario"}</label>
                <input type="text" name="usuario" value={formData.usuario} onChange={onChange} className="glitch-input" />
              </div>
              <div className="input-group">
                <label className="neon-label">{"> Contraseña (dejar vacío para no cambiar)"}</label>
                <input type="password" name="password" value={formData.password} onChange={onChange} className="glitch-input" minLength={8} />
              </div>
              */}
            </>
          )}

          {/* === UPDATE (selector de usuario + campos usuario/password/estatus, correo read-only) === */}
          {mode === "update" && (
            <>
              <div className="input-group">
                <label className="neon-label">{"> Seleccionar usuario"}</label>
                <select name="id" value={updateForm.id} onChange={onSelectUserToUpdate} className="glitch-input" required>
                  <option value="">-- Elige un usuario --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.correo} {/* mostramos correo en el select */}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="neon-label">{"> Correo (solo lectura)"}</label>
                <input type="email" name="correo" value={updateForm.correo} readOnly className="glitch-input" />
              </div>

              <div className="input-group">
                <label className="neon-label">{"> Usuario"}</label>
                <input type="text" name="usuario" value={updateForm.usuario} onChange={onChangeUpd} className="glitch-input" />
              </div>

              <div className="input-group">
                <label className="neon-label">{"> Contraseña (dejar vacío para no cambiar)"}</label>
                <input type="password" name="password" value={updateForm.password} onChange={onChangeUpd} className="glitch-input" minLength={8} />
              </div>

              <div className="input-group">
                <label className="neon-label">{"> Estatus"}</label>
                <select name="estatus" value={updateForm.estatus} onChange={onChangeUpd} className="glitch-input">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </>
          )}

          {error && <p style={{ color: "#f803f8", marginTop: 6 }}>{error}</p>}

          <div className="form-actions">
            <button type="submit" className="neon-button" disabled={saving}>
              {saving ? "Guardando..." : (mode === "create" ? "Registrar" : "Guardar")}
            </button>
            <button type="button" className="neon-button back-btn" onClick={closePanel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        body { background-color: #0a0a0a; font-family: 'Orbitron', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .main-container { display: flex; gap: 20px; width: 90%; max-width: 1200px; }
        .cyber-container { background: rgba(10, 10, 10, 0.85); border: 1px solid #39ff14; border-radius: 8px; padding: 25px; flex: 1; box-shadow: 0 0 20px rgba(57, 255, 20, 0.5); }
        .form-title { color: #e0e0e0; text-align: center; font-size: 24px; margin-bottom: 25px; text-shadow: 0 0 10px #39ff14; }
        .header-actions { margin-bottom: 15px; }
        .neon-button { background: rgba(57, 255, 20, 0.15); color: #39ff14; border: 2px solid #39ff14; padding: 8px 16px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: all 0.3s; text-transform: uppercase; }
        .neon-button:hover { background: #39ff14; color: #0a0a0a; box-shadow: 0 0 15px #39ff14; }
        .cyber-table { width: 100%; border-collapse: collapse; }
        .cyber-table th { color: #f803f8; text-transform: uppercase; font-size: 14px; text-align: left; border-bottom: 2px solid #1f1f1f; padding: 10px; }
        .cyber-table td { color: #e0e0e0; padding: 10px; border-bottom: 1px solid #1f1f1f; }
        .status-pill { padding: 4px 10px; border-radius: 10px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-pill.activo { background-color: rgba(57, 255, 20, 0.2); color: #39ff14; }
        .status-pill.inactivo { background-color: rgba(248, 3, 248, 0.2); color: #f803f8; }
        .action-button { background: transparent; color: #39ff14; border: none; cursor: pointer; font-weight: bold; text-transform: uppercase; transition: color 0.3s; }
        .action-button:hover { color: #f803f8; text-shadow: 0 0 5px #f803f8; }
        .side-panel { background: rgba(10, 10, 10, 0.9); border: 1px solid #39ff14; border-radius: 8px; padding: 20px; width: 0; opacity: 0; overflow: hidden; transition: all 0.3s; }
        .side-panel.open { width: 420px; opacity: 1; box-shadow: 0 0 20px rgba(57, 255, 20, 0.5); }
        .panel-title { color: #e0e0e0; text-align: center; font-size: 20px; margin-bottom: 20px; text-shadow: 0 0 10px #39ff14; }
        .input-group { margin-bottom: 20px; } .neon-label { color: #39ff14; font-size: 13px; display: block; margin-bottom: 5px; }
        .glitch-input { width: 100%; padding: 10px; background-color: #0a0a0a; color: #e0e0e0; border: 1px solid #1f1f1f; font-size: 14px; }
        .glitch-input:focus { border-color: #39ff14; outline: none; box-shadow: 0 0 8px #39ff14; }
        .form-actions { display: flex; gap: 10px; margin-top: 20px; }
        .form-actions .back-btn { border-color: #f803f8; color: #f803f8; }
        .form-actions .back-btn:hover { background: #f803f8; color: #0a0a0a; }
      `}</style>
    </div>
  );
};

export default UserTableCyberpunk;
