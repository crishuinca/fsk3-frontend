const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:8080/api/v1')

function getAuthToken() {
  return localStorage.getItem('authToken')
}

async function request(path, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let resp

  try {
    resp = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Error de conexión con el servidor')
  }

  if (!resp.ok) {
    let message = 'No se pudo cargar la informacion'
    try {
      const error = await resp.json()
      message = error.error || message
    } catch {
      message = await resp.text()
    }
    throw new Error(message)
  }

  return resp.json()
}

export function getPerfilEstudiante(estudianteId) {
  return request(`/perfilEstudiante/${estudianteId}`)
}

export function getPerfilEstudiantePorRut(rut) {
  return request(`/perfilEstudianteRut/${encodeURIComponent(rut)}`)
}

export function getAnotacionDetalle(id) {
  return request(`/anotacionDetalle/${id}`)
}

export function getAsistenciaDetalle(id) {
  return request(`/asistenciaDetalle/${id}`)
}

export function createAnotacion(data) {
  return request('/anotaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function createAsistencia(data) {
  return request('/asistencias', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export { API_URL }
