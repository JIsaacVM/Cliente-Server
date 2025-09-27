import React, { useState } from 'react';
// Asumimos que los estilos CSS para las clases 'auth-container', 'tab-button', etc., se definirán aparte.

function Login() {
    // Usamos el estado para controlar qué 'tab' (pestaña/formulario) está activo.
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        // Contenedor principal para centrar y estilizar
        <div className='auth-container'>

            {/* 1. Selector de Pestañas (Toggle) */}
            <div className='tab-switcher'>
                <button
                    className={`tab-button ${isLoginView ? 'active' : ''}`}
                    onClick={() => setIsLoginView(true)}
                >
                    Iniciar Sesión
                </button>
                <button
                    className={`tab-button ${!isLoginView ? 'active' : ''}`}
                    onClick={() => setIsLoginView(false)}
                >
                    Registrarse
                </button>
            </div>

            {/* 2. Contenedor del Formulario Activo (Renderizado Condicional) */}
            <div className='form-content'>
                {isLoginView ? (
                    // --- Formulario de LOGIN ---
                    <div className='auth-form login-form'>
                        <h2 className='form-title'>Bienvenido de Nuevo</h2>

                        <div className='input-group'>
                            <label htmlFor="login-email">Correo Electrónico</label>
                            <input id="login-email" type='text' placeholder='tu.email@ejemplo.com' required />
                        </div>
                        <div className='input-group'>
                            <label htmlFor="login-password">Contraseña</label>
                            <input id="login-password" type='password' placeholder='********' required />
                        </div>

                        <button className='submit-button primary-button'>Acceder</button>

                        <p className='forgot-password'>
                            <a href='#'>¿Olvidaste tu contraseña?</a>
                        </p>
                    </div>
                ) : (
                    // --- Formulario de REGISTER ---
                    <div className='auth-form register-form'>
                        <h2 className='form-title'>Crea tu Cuenta</h2>

                        <div className='input-group'>
                            <label htmlFor="register-name">Nombre Completo</label>
                            <input id="register-name" type='text' placeholder='Juan Pérez' required />
                        </div>
                        <div className='input-group'>
                            <label htmlFor="register-email">Correo Electrónico</label>
                            <input id="register-email" type='text' placeholder='tu.email@ejemplo.com' required />
                        </div>
                        <div className='input-group'>
                            <label htmlFor="register-password">Contraseña</label>
                            <input id="register-password" type='password' placeholder='Mínimo 8 caracteres' required />
                        </div>

                        <button className='submit-button primary-button'>Registrar</button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Login;