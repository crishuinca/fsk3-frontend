const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api/v1'

async function request(path) {
  const resp = await fetch(`${API_URL}${path}`)

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

export function getPerfilEstudiante(estudianteId, cursoId) {
  return request(`/perfilEstudiante/${estudianteId}?cursoId=${cursoId}`)
}

export function getAnotacionDetalle(id) {
  return request(`/anotacionDetalle/${id}`)
}

export function getAsistenciaDetalle(id) {
  return request(`/asistenciaDetalle/${id}`)
}

export { API_URL }
