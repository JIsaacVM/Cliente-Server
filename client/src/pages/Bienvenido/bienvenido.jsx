import React from 'react';

// Componente para la página de bienvenida con estilo cyberpunk.
const bienvenido = () => {
    // El JSX que se renderizará. Incluye los estilos y la estructura de la página.
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
              padding: 60px 40px;
              transition: transform 0.3s ease-in-out, box-shadow 0.3s, border-color 0.3s;
              backdrop-filter: blur(5px);
              text-align: center;
          }
          
          .cyber-container:hover {
              transform: translateY(-5px);
              box-shadow: 0 0 35px rgba(248, 3, 248, 0.5);
              border-color: var(--neon-pink);
          }

          /* Títulos y Texto (efecto neon) */
          .welcome-title {
              color: var(--neon-white);
              text-align: center;
              margin: 0;
              font-size: 48px;
              text-shadow: 0 0 8px var(--neon-green), 0 0 15px var(--neon-pink);
              font-family: var(--font-primary);
              letter-spacing: 3px;
              text-transform: uppercase;
              animation: flicker 1.5s infinite alternate;
          }

          /* Animación de parpadeo para el texto */
          @keyframes flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% {
              text-shadow:
                0 0 4px var(--neon-green),
                0 0 11px var(--neon-green),
                0 0 19px var(--neon-green),
                0 0 40px var(--neon-pink),
                0 0 80px var(--neon-pink),
                0 0 90px var(--neon-pink),
                0 0 100px var(--neon-pink),
                0 0 150px var(--neon-pink);
            }
            20%, 24%, 55% {        
              text-shadow: none;
            }
          }
        `}
            </style>
            <div className="cyber-container">
                <h1 className="welcome-title">BIENVENIDO</h1>
            </div>
        </>
    );
};

export default bienvenido;