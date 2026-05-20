import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

export function renderWithProviders(ui, { rol = 'PROFESOR', route = '/', estudianteId = null } = {}) {
  const user = {
    id: 1,
    nombreUsuario: 'usuario.test',
    email: 'usuario.test@colegio.cl',
    rol,
    ...(estudianteId != null ? { estudianteId } : {}),
  }

  localStorage.setItem('authToken', 'token.test')
  localStorage.setItem('authUser', JSON.stringify(user))
  localStorage.setItem('rolActual', rol)

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthProvider>,
  )
}
