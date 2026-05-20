import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { AuthProvider } from '../context/AuthContext'
import Login from './Login'
import CrearUsuario from './CrearUsuario'

const apiMocks = vi.hoisted(() => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  createUser: vi.fn(),
  getProximoEstudianteId: vi.fn(),
}))

vi.mock('../services/authApi', () => apiMocks)

function renderWithAuth(ui, { rol } = {}) {
  localStorage.clear()
  if (rol) {
    const user = {
      id: 1,
      nombreUsuario: 'usuario.test',
      email: 'usuario.test@colegio.cl',
      rol,
    }
    localStorage.setItem('authToken', 'token.test')
    localStorage.setItem('authUser', JSON.stringify(user))
    localStorage.setItem('rolActual', rol)
  }

  return render(
    <AuthProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthProvider>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    apiMocks.getCurrentUser.mockResolvedValue(null)
  })

  it('muestra validacion si faltan credenciales', async () => {
    renderWithAuth(<Login />)

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }))

    expect(await screen.findByText('Debe ingresar usuario o correo y contrasena.')).toBeInTheDocument()
    expect(apiMocks.login).not.toHaveBeenCalled()
  })

  it('envia login con datos del formulario', async () => {
    apiMocks.login.mockResolvedValue({
      token: 'jwt',
      usuario: { nombreUsuario: 'inspector', rol: 'INSPECTOR' },
    })
    renderWithAuth(<Login />)

    fireEvent.change(screen.getByPlaceholderText(/usuario o correo/i), {
      target: { value: 'inspector' },
    })
    fireEvent.change(document.querySelector('input[type="password"]'), {
      target: { value: 'clave123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }))

    await waitFor(() => expect(apiMocks.login).toHaveBeenCalledWith('inspector', 'clave123'))
  })

  it('muestra error si login falla', async () => {
    apiMocks.login.mockRejectedValue(new Error('Usuario o contrasena incorrectos.'))
    renderWithAuth(<Login />)

    fireEvent.change(screen.getByPlaceholderText(/usuario o correo/i), { target: { value: 'x' } })
    fireEvent.change(document.querySelector('input[type="password"]'), { target: { value: 'y' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesion/i }))

    expect(await screen.findByText('Usuario o contrasena incorrectos.')).toBeInTheDocument()
  })
})

describe('CrearUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMocks.getCurrentUser.mockImplementation(async () => {
      const raw = localStorage.getItem('authUser')
      return raw ? JSON.parse(raw) : null
    })
    apiMocks.getProximoEstudianteId.mockResolvedValue(3)
    apiMocks.createUser.mockResolvedValue({ nombreUsuario: 'profesor2', rol: 'PROFESOR' })
  })

  it('restringe acceso si no es inspector', async () => {
    renderWithAuth(<CrearUsuario />, { rol: 'PROFESOR' })

    await waitFor(() => expect(screen.queryByText('Crear usuario')).not.toBeInTheDocument())
  })

  it('valida campos obligatorios al crear profesor', async () => {
    renderWithAuth(<CrearUsuario />, { rol: 'INSPECTOR' })

    expect(await screen.findByRole('heading', { name: /crear usuario/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^crear usuario$/i }))

    expect(await screen.findByText('Complete todos los campos obligatorios.')).toBeInTheDocument()
  })

  it('crea usuario profesor con datos validos', async () => {
    renderWithAuth(<CrearUsuario />, { rol: 'INSPECTOR' })

    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'profesor2' } })
    fireEvent.change(screen.getByLabelText(/correo electronico/i), { target: { value: 'profesor2@colegio.cl' } })
    fireEvent.change(screen.getByPlaceholderText(/minimo 6 caracteres/i), { target: { value: 'clave123' } })
    fireEvent.click(screen.getByRole('button', { name: /^crear usuario$/i }))

    await waitFor(() => expect(apiMocks.createUser).toHaveBeenCalled())
    expect(await screen.findByText(/usuario profesor2 creado correctamente/i)).toBeInTheDocument()
  })

  it('al elegir alumno carga proximo id estimado', async () => {
    renderWithAuth(<CrearUsuario />, { rol: 'INSPECTOR' })

    fireEvent.change(screen.getByLabelText(/rol/i), { target: { value: 'ALUMNO' } })

    expect(await screen.findByLabelText(/id estimado del estudiante/i)).toBeInTheDocument()
    await waitFor(() => expect(apiMocks.getProximoEstudianteId).toHaveBeenCalled())
    expect(await screen.findByDisplayValue('3')).toBeInTheDocument()
  })

  it('crea alumno con ficha estudiante completa', async () => {
    apiMocks.createUser.mockResolvedValue({
      nombreUsuario: 'alumno2',
      rol: 'ALUMNO',
      estudianteId: 4,
    })
    renderWithAuth(<CrearUsuario />, { rol: 'INSPECTOR' })

    fireEvent.change(screen.getByLabelText(/rol/i), { target: { value: 'ALUMNO' } })
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'alumno2' } })
    fireEvent.change(screen.getByLabelText(/correo electronico/i), { target: { value: 'alumno2@colegio.cl' } })
    fireEvent.change(screen.getByPlaceholderText(/minimo 6 caracteres/i), { target: { value: 'clave123' } })
    fireEvent.change(screen.getByLabelText(/^rut$/i), { target: { value: '21345678-9' } })
    fireEvent.change(screen.getByLabelText(/^nombres$/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/apellido paterno/i), { target: { value: 'Lopez' } })
    fireEvent.change(screen.getByLabelText(/apellido materno/i), { target: { value: 'Perez' } })
    fireEvent.click(screen.getByRole('button', { name: /^crear usuario$/i }))

    await waitFor(() => expect(apiMocks.createUser).toHaveBeenCalled())
    expect(await screen.findByText(/estudiante ID 4/i)).toBeInTheDocument()
  })
})
