// Decodifica el token JWT guardado en localStorage
export const obtenerUsuarioDesdeToken = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const datos = JSON.parse(atob(payload));

    return datos;
  } catch (error) {
    console.error(error);
    return null;
  }
};