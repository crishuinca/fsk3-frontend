import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { usePerfilEstudianteBusqueda } from './usePerfilEstudianteBusqueda'

const apiMocks = vi.hoisted(() => ({
  getPerfilEstudiante: vi.fn(),
  getPerfilEstudiantePorRut: vi.fn(),
}))

vi.mock('../services/bffApi', () => apiMocks)

vi.mock('../services/authApi', () => ({
  getCurrentUser: vi.fn(() => {
    const raw = localStorage.getItem('authUser')
    return Promise.resolve(raw ? JSON.parse(raw) : null)
  }),
  login: vi.fn(),
}))

const perfilDemo = {
  estudiante: { id: 1, rut: '1-9', nombres: 'Ana', apellidoPaterno: 'Lopez', apellidoMaterno: 'Perez' },
  curso: { id: 1, nivel: '2 Medio', letra: 'A', anio: 2026 },
  anotaciones: [],
  asistencias: [],
}

function wrapper({ children }) {
  return (
    <AuthProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthProvider>
  )
}

function seedAlumno(estudianteId) {
  localStorage.setItem('authToken', 'token.test')
  localStorage.setItem('authUser', JSON.stringify({
    id: 2,
    nombreUsuario: 'alumno1',
    email: 'alumno1@colegio.cl',
    rol: 'ALUMNO',
    estudianteId,
  }))
  localStorage.setItem('rolActual', 'ALUMNO')
}

describe('usePerfilEstudianteBusqueda', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    apiMocks.getPerfilEstudiante.mockResolvedValue(perfilDemo)
  })

  it('carga perfil automaticamente para alumno con estudiante vinculado', async () => {
    seedAlumno(1)

    const { result } = renderHook(() => usePerfilEstudianteBusqueda(), { wrapper })

    await waitFor(() => expect(result.current.perfil).toEqual(perfilDemo))
    expect(apiMocks.getPerfilEstudiante).toHaveBeenCalledWith(1)
    expect(result.current.esAlumno).toBe(true)
  })

  it('muestra error si alumno no tiene estudiante vinculado', async () => {
    seedAlumno(null)

    const { result } = renderHook(() => usePerfilEstudianteBusqueda(), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toMatch(/no tiene ID de estudiante vinculado/i)
    })
    expect(result.current.perfil).toBeNull()
    expect(apiMocks.getPerfilEstudiante).not.toHaveBeenCalled()
  })

  it('profesor puede buscar por RUT', async () => {
    localStorage.setItem('authToken', 'token.test')
    localStorage.setItem('authUser', JSON.stringify({
      id: 1,
      nombreUsuario: 'profesor',
      email: 'profesor@colegio.cl',
      rol: 'PROFESOR',
    }))
    apiMocks.getPerfilEstudiantePorRut.mockResolvedValue(perfilDemo)

    const { result } = renderHook(() => usePerfilEstudianteBusqueda(), { wrapper })

    act(() => {
      result.current.setTipoBusqueda('rut')
      result.current.setRut('21827564-8')
    })

    await act(async () => {
      await result.current.buscarPerfil({ preventDefault: () => {} })
    })

    expect(apiMocks.getPerfilEstudiantePorRut).toHaveBeenCalledWith('21827564-8')
    expect(result.current.perfil).toEqual(perfilDemo)
  })

  it('valida RUT vacio para profesor', async () => {
    localStorage.setItem('authToken', 'token.test')
    localStorage.setItem('authUser', JSON.stringify({
      id: 1,
      nombreUsuario: 'profesor',
      email: 'profesor@colegio.cl',
      rol: 'PROFESOR',
    }))

    const { result } = renderHook(() => usePerfilEstudianteBusqueda(), { wrapper })

    act(() => {
      result.current.setTipoBusqueda('rut')
      result.current.setRut('   ')
    })

    await act(async () => {
      await result.current.buscarPerfil({ preventDefault: () => {} })
    })

    expect(result.current.error).toMatch(/Debe ingresar el RUT/i)
    expect(result.current.perfil).toBeNull()
  })

  it('propaga error de API al cargar perfil', async () => {
    seedAlumno(1)
    apiMocks.getPerfilEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'))

    const { result } = renderHook(() => usePerfilEstudianteBusqueda(), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBe('Estudiante no encontrado')
    })
    expect(result.current.perfil).toBeNull()
  })
})
