import axios from 'axios'

// La dirección del backend se toma de VITE_API_URL para que cambiar de
// servidor sea cuestión de tocar una variable en Vercel y volver a publicar,
// sin editar código. El valor de respaldo es el despliegue actual, así que en
// local funciona sin configurar nada.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fmds-backend-production-9925.up.railway.app/api',
})

// Agrega el token automáticamente a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expiró o es inválido, se cierra la sesión y se vuelve a login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.clear()
      window.location.href = '/login?expirada=1'
    }
    return Promise.reject(error)
  }
)

export default api