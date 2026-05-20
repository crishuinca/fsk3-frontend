import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthContext'
import { useAuth } from '../hooks/useAuth'

const authApiMocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
}))

vi.mock('../services/authApi', () => authApiMocks)

function TestApp() {
  const { user, loading, isAuthenticated, login, logout } = useAuth()

  return (
    <>
      <span data-testid="loading">{loading ? 'si' : 'no'}</span>
      <span data-testid="auth">{isAuthenticated ? 'si' : 'no'}</span>
      <span data-testid="user">{user?.nombreUsuario || 'ninguno'}</span>
      <button type="button" onClick={() => login('profesor', 'clave123')}>login</button>
      <button type="button" onClick={logout}>logout</button>
    </>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('valida sesion al iniciar con token guardado', async () => {
    localStorage.setItem('authToken', 'token-viejo')
    localStorage.setItem('authUser', JSON.stringify({
      id: 1,
      nombreUsuario: 'profesor',
      email: 'profesor@colegio.cl',
      rol: 'PROFESOR',
    }))
    authApiMocks.getCurrentUser.mockResolvedValue({
      id: 1,
      nombreUsuario: 'profesor',
      email: 'profesor@colegio.cl',
      rol: 'PROFESOR',
    })

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('no'))
    expect(authApiMocks.getCurrentUser).toHaveBeenCalledWith('token-viejo')
    expect(screen.getByTestId('user')).toHaveTextContent('profesor')
  })

  it('limpia sesion si validacion falla', async () => {
    localStorage.setItem('authToken', 'token-invalido')
    localStorage.setItem('authUser', JSON.stringify({ nombreUsuario: 'x', rol: 'PROFESOR' }))
    authApiMocks.getCurrentUser.mockRejectedValue(new Error('401'))

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('auth')).toHaveTextContent('no'))
    expect(localStorage.getItem('authToken')).toBeNull()
  })

  it('login y logout actualizan estado y localStorage', async () => {
    const usuarioInspector = {
      id: 2,
      nombreUsuario: 'inspector',
      email: 'inspector@colegio.cl',
      rol: 'INSPECTOR',
    }
    authApiMocks.getCurrentUser.mockResolvedValue(usuarioInspector)
    authApiMocks.login.mockResolvedValue({
      token: 'nuevo-token',
      usuario: usuarioInspector,
    })

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('inspector'))
    expect(localStorage.getItem('authToken')).toBe('nuevo-token')

    fireEvent.click(screen.getByRole('button', { name: 'logout' }))

    await waitFor(() => expect(screen.getByTestId('auth')).toHaveTextContent('no'))
    expect(localStorage.getItem('authToken')).toBeNull()
  })
})
