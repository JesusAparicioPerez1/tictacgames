import { useState } from 'react';

import api from '../services/api';
import { obtenerUsuarioDesdeToken } from '../utils/auth';

// Modal de autenticación para iniciar sesión o registrarse
function AuthModal({
  abierto,
  modoInicial = 'login',
  cerrarModal,
  onLoginCorrecto,
}) {
  // Controla si se muestra login o registro
  const [modo, setModo] = useState(modoInicial);

  // Mensaje de error o estado
  const [mensaje, setMensaje] = useState('');

  // Formulario de login
  const [loginForm, setLoginForm] = useState({
    correo: '',
    contrasena: '',
  });

  // Formulario de registro
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
  });

  // Si el modal no está abierto, no se muestra nada
  if (!abierto) {
    return null;
  }

  // Actualiza los campos del login
  const manejarLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // Actualiza los campos del registro
  const manejarRegistroChange = (e) => {
    setRegistroForm({
      ...registroForm,
      [e.target.name]: e.target.value,
    });
  };

  // Inicia sesión
  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/usuarios/login', loginForm);

      localStorage.setItem('token', res.data.token);

      const usuario = obtenerUsuarioDesdeToken();

      setMensaje('');
      cerrarModal();
      onLoginCorrecto(usuario);
    } catch (error) {
      console.error(error);

      const mensajeBackend = error.response?.data?.mensaje;

      if (
        mensajeBackend === 'Usuario no encontrado' ||
        error.response?.status === 404
      ) {
        setMensaje('El usuario no está registrado. Puedes crear una cuenta.');
      } else {
        setMensaje(mensajeBackend || 'Error al iniciar sesión');
      }
    }
  };

  // Registra un usuario nuevo
  const registrarse = async (e) => {
    e.preventDefault();

    try {
      await api.post('/usuarios/registro', registroForm);

      setMensaje('Usuario registrado correctamente. Ahora puedes iniciar sesión.');

      setModo('login');

      setLoginForm({
        correo: registroForm.correo,
        contrasena: '',
      });

      setRegistroForm({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
      });
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje || 'Error al registrar usuario'
      );
    }
  };

  // Cambia de login a registro
  const irARegistro = () => {
    setModo('registro');
    setMensaje('');
  };

  // Cambia de registro a login
  const irALogin = () => {
    setModo('login');
    setMensaje('');
  };

  return (
    <div className="modal-fondo">
      <div className="modal-contenido auth-modal">
        <div className="modal-cabecera">
          <h3>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h3>

          <button type="button" onClick={cerrarModal}>
            Cerrar
          </button>
        </div>

        {mensaje && (
          <p className="mensaje-producto">
            {mensaje}
          </p>
        )}

        {modo === 'login' && (
          <form onSubmit={iniciarSesion}>
            <input
              type="email"
              name="correo"
              value={loginForm.correo}
              onChange={manejarLoginChange}
              placeholder="Correo"
              required
            />

            <input
              type="password"
              name="contrasena"
              value={loginForm.contrasena}
              onChange={manejarLoginChange}
              placeholder="Contraseña"
              required
            />

            <button type="submit">
              Entrar
            </button>

            <button
              type="button"
              className="btn-secundario"
              onClick={irARegistro}
            >
              Registrarse
            </button>
          </form>
        )}

        {modo === 'registro' && (
          <form onSubmit={registrarse}>
            <input
              type="text"
              name="nombre"
              value={registroForm.nombre}
              onChange={manejarRegistroChange}
              placeholder="Nombre"
              required
            />

            <input
              type="email"
              name="correo"
              value={registroForm.correo}
              onChange={manejarRegistroChange}
              placeholder="Correo"
              required
            />

            <input
              type="password"
              name="contrasena"
              value={registroForm.contrasena}
              onChange={manejarRegistroChange}
              placeholder="Contraseña"
              required
            />

            <button type="submit">
              Crear cuenta
            </button>

            <button
              type="button"
              className="btn-secundario"
              onClick={irALogin}
            >
              Ya tengo cuenta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;