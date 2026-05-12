import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  API_URL,
  createAnotacion,
  createAsistencia,
  getPerfilEstudiante,
  getPerfilEstudiantePorRut,
} from './bffApi'

describe('bffApi', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('consulta perfil por ID usando la URL del BFF', async () => {
    const perfil = { estudiante: { id: 1 } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => perfil,
    }))

    const resultado = await getPerfilEstudiante(1)

    expect(resultado).toBe(perfil)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/perfilEstudiante/1`, {
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('codifica el RUT cuando consulta perfil por RUT', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ estudiante: { rut: '21.827.564-8' } }),
    }))

    await getPerfilEstudiantePorRut('21.827.564-8')

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/perfilEstudianteRut/21.827.564-8`,
      { headers: { 'Content-Type': 'application/json' } },
    )
  })

  it('envia anotaciones y asistencias por POST', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 10 }),
    }))

    await createAnotacion({ estudianteId: 1, descripcion: 'Participa' })
    await createAsistencia({ estudianteId: 1, estado: 'PRESENTE' })

    expect(fetch).toHaveBeenNthCalledWith(1, `${API_URL}/anotaciones`, {
      method: 'POST',
      body: JSON.stringify({ estudianteId: 1, descripcion: 'Participa' }),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(fetch).toHaveBeenNthCalledWith(2, `${API_URL}/asistencias`, {
      method: 'POST',
      body: JSON.stringify({ estudianteId: 1, estado: 'PRESENTE' }),
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('muestra error claro si el BFF no responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')))

    await expect(getPerfilEstudiante(1)).rejects.toThrow('Error de conexión con el servidor')
  })

  it('usa mensaje de error enviado por el BFF', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Estudiante no encontrado' }),
    }))

    await expect(getPerfilEstudiante(999)).rejects.toThrow('Estudiante no encontrado')
  })
})
