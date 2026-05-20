import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  API_URL,
  createUser,
  getCurrentUser,
  getProximoEstudianteId,
  listUsers,
  login,
} from './authApi'

describe('authApi', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('login envia credenciales al BFF', async () => {
    const response = { token: 'jwt', usuario: { nombreUsuario: 'inspector' } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => response,
    }))

    const resultado = await login('inspector', 'clave123')

    expect(resultado).toBe(response)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ identificador: 'inspector', password: 'clave123' }),
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('getCurrentUser envia bearer token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ nombreUsuario: 'inspector', rol: 'INSPECTOR' }),
    }))

    await getCurrentUser('token-abc')

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/auth/me`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-abc',
        }),
      }),
    )
  })

  it('createUser y listUsers usan token del inspector', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 2 }),
    }))

    await createUser({ nombreUsuario: 'alumno1', rol: 'ALUMNO' }, 'token-inspector')
    await listUsers('token-inspector')

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      `${API_URL}/auth/crearUsuario`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer token-inspector' }),
      }),
    )
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      `${API_URL}/auth/usuarios`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-inspector' }),
      }),
    )
  })

  it('getProximoEstudianteId consulta endpoint protegido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => 5,
    }))

    const id = await getProximoEstudianteId('token-inspector')

    expect(id).toBe(5)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/auth/proximo-estudiante-id`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-inspector' }),
      }),
    )
  })

  it('muestra error de conexion si fetch falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')))

    await expect(login('inspector', 'clave123')).rejects.toThrow('Error de conexion con el servidor')
  })

  it('usa mensaje de error del BFF', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Usuario o contrasena incorrectos.' }),
    }))

    await expect(login('x', 'y')).rejects.toThrow('Usuario o contrasena incorrectos.')
  })

  it('getCurrentUser retorna null en respuesta 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    }))

    await expect(getCurrentUser('token')).resolves.toBeNull()
  })
})
