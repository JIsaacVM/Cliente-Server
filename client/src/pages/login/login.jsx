import React, { useState } from 'react';

// El componente principal de la aplicación que renderiza el formulario.
const App = () => {
    // Hook de estado para rastrear la pestaña activa ('login' o 'signup').
    const [activeTab, setActiveTab] = useState('login');

    // Manejador para cambiar la pestaña activa.
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>

            <style>
                {`
          /* Importar fuente de Google Fonts */
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

          /* Variables para el Tema Neon Cyberpunk */
          :root {
              --neon-green: #39ff14; /* Verde Neón Brillante */
              --neon-pink: #f803f8; /* Rosa Neón para acentos */
              --neon-white: #e0e0e0; /* Blanco ligeramente grisáceo */
              --background-dark: #0a0a0a; /* Fondo casi negro */
              --shadow-light-green: 0 0 4px var(--neon-green), 0 0 10px var(--neon-green), 0 0 15px rgba(57, 255, 20, 0.5);
              --border-dark: #1f1f1f;
              /* Fuentes personalizadas */
              --font-primary: 'Orbitron', sans-serif;
              --font-secondary: 'Consolas', 'Courier New', monospace;
          }

          /* Estilo del cuerpo para el fondo oscuro y la fuente */
          body {
              background-color: var(--background-dark);
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: var(--font-secondary);
              background-image:
                  linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)),
                  url('https://placehold.co/1920x1080/0a0a0a/39ff14?text=GRID'); /* Placeholder for a grid background */
              background-size: cover;
          }

          /* Contenedor Principal (Tarjeta de Acceso) */
          .cyber-container {
              background: rgba(1, 1, 1, 0.85);
              border: 1px solid var(--neon-green);
              border-radius: 4px;
              box-shadow: 0 0 25px rgba(57, 255, 20, 0.5);
              width: 450px;
              max-width: 90%;
              padding: 30px 40px;
              transition: transform 0.3s ease-in-out, box-shadow 0.3s, border-color 0.3s;
              backdrop-filter: blur(5px);
          }
          
          .cyber-container:hover {
              transform: translateY(-5px);
              box-shadow: 0 0 35px rgba(248, 3, 248, 0.5);
              border-color: var(--neon-pink);
          }

          /* Títulos y Texto (efecto neon) */
          .form-title {
              color: var(--neon-white);
              text-align: center;
              margin-top: 0;
              margin-bottom: 35px;
              font-size: 24px;
              text-shadow: 0 0 5px var(--neon-green);
              font-family: var(--font-primary);
              letter-spacing: 2px;
              text-transform: uppercase;
          }

          /* --- TABS (TOGGLE) --- */
          .neon-switcher {
              display: flex;
              margin-bottom: 30px;
              background: var(--border-dark);
              border: 1px solid var(--border-dark);
              border-radius: 4px;
              overflow: hidden;
          }

          .neon-tab {
              flex: 1;
              padding: 12px 0;
              border: none;
              background: transparent;
              color: var(--neon-white);
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 1px;
              transition: all 0.2s ease-in-out;
              font-family: var(--font-primary);
          }

          .neon-tab.active {
              background-color: var(--background-dark);
              color: var(--neon-green);
              box-shadow: inset 0 0 8px rgba(57, 255, 20, 0.6);
              text-shadow: var(--shadow-light-green);
              border-bottom: 2px solid var(--neon-green);
          }
          .neon-tab:hover:not(.active) {
              background-color: rgba(57, 255, 20, 0.05);
              color: var(--neon-green);
          }

          /* --- INPUTS --- */
          .input-group {
              margin-bottom: 25px;
              position: relative;
          }

          .neon-label {
              display: block;
              margin-bottom: 8px;
              font-size: 13px;
              color: var(--neon-green);
              text-shadow: 0 0 3px rgba(57, 255, 20, 0.8);
              font-weight: bold;
          }

          .glitch-input {
              width: 100%;
              padding: 10px;
              background-color: var(--background-dark);
              color: var(--neon-white);
              border: 1px solid var(--border-dark);
              box-sizing: border-box;
              font-size: 16px;
              text-shadow: 0 0 1px var(--neon-green);
              transition: border-color 0.3s, box-shadow 0.3s;
          }

          .glitch-input:focus {
              outline: none;
              border-color: var(--neon-green);
              box-shadow: 0 0 8px rgba(57, 255, 20, 0.8);
              animation: neon-focus 0.1s infinite alternate;
          }
          @keyframes neon-focus {
              0% { transform: translate(1px, 1px); text-shadow: 0 0 2px var(--neon-pink); }
              100% { transform: translate(-1px, -1px); text-shadow: 0 0 2px var(--neon-green); }
          }

          /* --- BOTÓN --- */
          .neon-button {
              width: 100%;
              padding: 15px;
              margin-top: 15px;
              border: 2px solid var(--neon-green);
              border-radius: 4px;
              background-color: rgba(57, 255, 20, 0.2);
              color: var(--neon-green);
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              text-shadow: var(--shadow-light-green);
              box-shadow: var(--shadow-light-green);
              transition: all 0.3s;
              font-family: var(--font-primary);
          }

          .neon-button:hover {
              background-color: var(--neon-green);
              color: var(--background-dark);
              box-shadow: 0 0 20px var(--neon-green), 0 0 30px var(--neon-pink);
              text-shadow: none;
          }

          /* --- ENLACES MENORES --- */
          .link-minor {
              text-align: center;
              margin-top: 20px;
              font-size: 13px;
              color: var(--neon-white);
          }

          .link-minor a {
              color: var(--neon-green);
              text-decoration: none;
              text-shadow: 0 0 3px rgba(57, 255, 20, 0.5);
              transition: color 0.3s, text-shadow 0.3s;
          }

          .link-minor a:hover {
              color: var(--neon-pink);
              text-shadow: 0 0 5px var(--neon-pink);
          }
        `}
            </style>
            <div className="cyber-container">


                <div className="neon-switcher">
                    <button
                        className={`neon-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => handleTabClick('login')}
                    >
                        LOGIN
                    </button>
                    <button
                        className={`neon-tab ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => handleTabClick('signup')}
                    >
                        CREAR CUENTA
                    </button>
                </div>

                {/* Renderizado condicional del formulario de Login */}
                {activeTab === 'login' && (
                    <div id="login" className="form-content active">
                        <form>
                            <div className="input-group">
                                <label htmlFor="login-user" className="neon-label">{'USUARIO'}</label>
                                <input type="text" id="login-user" className="glitch-input" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="login-pass" className="neon-label">{'CONTRASEÑA'}</label>
                                <input type="password" id="login-pass" className="glitch-input" required />
                            </div>
                            <button type="submit" className="neon-button">INICIAR SESIÓN</button>

                        </form>
                    </div>
                )}


                {activeTab === 'signup' && (
                    <div id="signup" className="form-content active">
                        <form>
                            <div className="input-group">
                                <label htmlFor="signup-user" className="neon-label">{'NOMBRE'}</label>
                                <input type="text" id="signup-user" className="glitch-input" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signup-email" className="neon-label">{'EMAIL'}</label>
                                <input type="email" id="signup-email" className="glitch-input" required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signup-pass" className="neon-label">{'CONTRASEÑA'}</label>
                                <input type="password" id="signup-pass" className="glitch-input" required />
                            </div>
                            <button type="submit" className="neon-button">CREAR CUENTA</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default App;
