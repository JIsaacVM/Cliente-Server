import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../../services/authService';
import { crearUsuarioDefaultActivo } from '../../services/usuariosApi';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [signupForm, setSignupForm] = useState({ nombre: '', correo: '', usuario: '', password: '' });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupOk, setSignupOk] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setLoginError('');
    setSignupError('');
    setSignupOk('');
  };

  const onChangeLogin = (e) => setLoginForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onChangeSignup = (e) => setSignupForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { user } = await loginService(loginForm);
      if (Number(user.rol) === 2) navigate('/usuarios', { replace: true });
      else navigate('/bienvenido', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al iniciar sesión';
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Registro con estatus = Activo (default en el backend)
  const onSubmitSignup = async (e) => {
    e.preventDefault();
    setSignupError(''); setSignupOk(''); setSignupLoading(true);
    try {
      await crearUsuarioDefaultActivo(signupForm);
      setSignupOk('Cuenta creada (Activo). Ahora inicia sesión.');
      setActiveTab('login');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al crear la cuenta';
      setSignupError(msg);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
        :root {
          --neon-green: #39ff14; --neon-pink: #f803f8; --neon-white: #e0e0e0; --background-dark: #0a0a0a;
          --shadow-light-green: 0 0 4px var(--neon-green), 0 0 10px var(--neon-green), 0 0 15px rgba(57, 255, 20, 0.5);
          --border-dark: #1f1f1f; --font-primary: 'Orbitron', sans-serif; --font-secondary: 'Consolas', 'Courier New', monospace;
        }
        body { background-color:#0a0a0a; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; font-family:var(--font-secondary);
          background-image: linear-gradient(rgba(10,10,10,0.8),rgba(10,10,10,0.8)), url('https://placehold.co/1920x1080/0a0a0a/39ff14?text=GRID'); background-size: cover; }
        .cyber-container { background:rgba(1,1,1,0.85); border:1px solid var(--neon-green); border-radius:4px; box-shadow:0 0 25px rgba(57,255,20,0.5);
          width:450px; max-width:90%; padding:30px 40px; transition:transform .3s, box-shadow .3s, border-color .3s; backdrop-filter: blur(5px); }
        .cyber-container:hover { transform: translateY(-5px); box-shadow: 0 0 35px rgba(248,3,248,0.5); border-color: var(--neon-pink); }
        .neon-switcher { display:flex; margin-bottom:30px; background:var(--border-dark); border:1px solid var(--border-dark); border-radius:4px; overflow:hidden; }
        .neon-tab { flex:1; padding:12px 0; border:none; background:transparent; color:var(--neon-white); cursor:pointer; font-size:14px; font-weight:bold; letter-spacing:1px; transition:all .2s; font-family:var(--font-primary); }
        .neon-tab.active { background-color: var(--background-dark); color: var(--neon-green); box-shadow: inset 0 0 8px rgba(57,255,20,0.6); border-bottom:2px solid var(--neon-green); }
        .input-group { margin-bottom:25px; } .neon-label { display:block; margin-bottom:8px; font-size:13px; color:var(--neon-green); text-shadow:0 0 3px rgba(57,255,20,0.8); font-weight:bold; }
        .glitch-input { width:100%; padding:10px; background-color:#0a0a0a; color:var(--neon-white); border:1px solid var(--border-dark); font-size:16px; }
        .glitch-input:focus { outline:none; border-color:var(--neon-green); box-shadow:0 0 8px rgba(57,255,20,0.8); }
        .neon-button { width:100%; padding:15px; margin-top:15px; border:2px solid var(--neon-green); border-radius:4px; background-color:rgba(57,255,20,0.2);
          color:var(--neon-green); font-size:16px; font-weight:bold; cursor:pointer; box-shadow: var(--shadow-light-green); }
        .neon-button:hover { background-color: var(--neon-green); color: #0a0a0a; box-shadow: 0 0 20px var(--neon-green), 0 0 30px var(--neon-pink); }
      `}</style>

      <div className="cyber-container">
        <div className="neon-switcher">
          <button className={`neon-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => handleTabClick('login')}>LOGIN</button>
          <button className={`neon-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabClick('signup')}>CREAR CUENTA</button>
        </div>

        {activeTab === 'login' && (
          <div id="login" className="form-content active">
            <form onSubmit={onSubmitLogin}>
              <div className="input-group">
                <label className="neon-label">USUARIO o EMAIL</label>
                <input type="text" name="usuario" className="glitch-input" value={loginForm.usuario} onChange={onChangeLogin} required />
              </div>
              <div className="input-group">
                <label className="neon-label">CONTRASEÑA</label>
                <input type="password" name="password" className="glitch-input" value={loginForm.password} onChange={onChangeLogin} minLength={8} required />
              </div>
              <button type="submit" className="neon-button" disabled={loginLoading}>{loginLoading ? 'Entrando...' : 'INICIAR SESIÓN'}</button>
              {loginError && <p style={{ color:'#f55', marginTop:10 }}>{loginError}</p>}
            </form>
          </div>
        )}

        {activeTab === 'signup' && (
          <div id="signup" className="form-content active">
            <form onSubmit={onSubmitSignup}>
              <div className="input-group">
                <label className="neon-label">NOMBRE</label>
                <input type="text" name="nombre" className="glitch-input" value={signupForm.nombre} onChange={onChangeSignup} required />
              </div>
              <div className="input-group">
                <label className="neon-label">EMAIL</label>
                <input type="email" name="correo" className="glitch-input" value={signupForm.correo} onChange={onChangeSignup} required />
              </div>
              <div className="input-group">
                <label className="neon-label">USUARIO</label>
                <input type="text" name="usuario" className="glitch-input" value={signupForm.usuario} onChange={onChangeSignup} required />
              </div>
              <div className="input-group">
                <label className="neon-label">CONTRASEÑA</label>
                <input type="password" name="password" className="glitch-input" value={signupForm.password} onChange={onChangeSignup} minLength={8} required />
              </div>
              <button type="submit" className="neon-button" disabled={signupLoading}>{signupLoading ? 'Creando...' : 'CREAR CUENTA'}</button>
              {signupError && <p style={{ color:'#f55', marginTop:10 }}>{signupError}</p>}
              {signupOk && <p style={{ color:'#39ff14', marginTop:10 }}>{signupOk}</p>}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
