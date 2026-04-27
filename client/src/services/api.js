import axios from 'axios';

// Instancia base para conectar con el backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default api;