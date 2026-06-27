const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:8080/api/v1')

async function authRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  let resp
  try {
    resp = await fetch(`${API_URL}/auth${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Error de conexion con el servidor')
  }

  if (!resp.ok) {
    let message = 'No se pudo completar la solicitud'
    try {
      const error = await resp.json()
      message = error.error || message
    } catch {
      message = await resp.text()
    }
    throw new Error(message)
  }

  if (resp.status === 204) {
    return null
  }

  return resp.json()
}

export function login(identificador, password) {
  return authRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ identificador, password }),
  })
}

export function getCurrentUser(token) {
  return authRequest('/me', { token })
}

export function createUser(data, token) {
  return authRequest('/crearUsuario', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  })
}

export function listUsers(token) {
  return authRequest('/usuarios', { token })
}

export function getProximoEstudianteId(token) {
  return authRequest('/proximo-estudiante-id', { token })
}

export { API_URL }
