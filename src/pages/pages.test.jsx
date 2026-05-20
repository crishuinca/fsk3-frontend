import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../test/test-utils'
import Home from './Home'
import PerfilEstudiante from './PerfilEstudiante'
import AnotacionDetalle from './AnotacionDetalle'
import AsistenciaDetalle from './AsistenciaDetalle'
import RegistrarAnotacion from './RegistrarAnotacion'
import RegistrarAsistencia from './RegistrarAsistencia'

const validarMocks = vi.hoisted(() => ({
  verificarEstudianteExiste: vi.fn(),
}))

vi.mock('../utils/validarEstudiante', () => validarMocks)

const apiMocks = vi.hoisted(() => ({
  getPerfilEstudiante: vi.fn(),
  getPerfilEstudiantePorRut: vi.fn(),
  createAnotacion: vi.fn(),
  createAsistencia: vi.fn(),
}))

vi.mock('../services/bffApi', () => apiMocks)

vi.mock('../services/authApi', () => ({
  getCurrentUser: vi.fn(() => {
    const raw = localStorage.getItem('authUser')
    return Promise.resolve(raw ? JSON.parse(raw) : null)
  }),
  login: vi.fn(),
  createUser: vi.fn(),
  listUsers: vi.fn(),
}))

const perfilDemo = {
  estudiante: {
    id: 1,
    rut: '21827564-8',
    nombres: 'Cristobal',
    apellidoPaterno: 'Huinca',
    apellidoMaterno: 'Aravena',
    email: 'cristobal@colegio.cl',
  },
  curso: {
    id: 2,
    nivel: '2 Medio',
    letra: 'A',
    anio: 2026,
    profesorJefeRut: '12345678-9',
  },
  anotaciones: [
    {
      id: 10,
      fecha: '2026-05-08',
      tipo: 'POSITIVA',
      descripcion: 'Participa activamente',
      registradaPor: '12345678-9',
    },
  ],
  asistencias: [
    {
      id: 20,
      fecha: '2026-05-08',
      estado: 'PRESENTE',
      observacion: 'Sin observacion',
      registradaPor: '12345678-9',
    },
  ],
}

describe('paginas frontend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    validarMocks.verificarEstudianteExiste.mockResolvedValue('')
  })

  it('Home muestra acciones segun rol inspector', () => {
    renderWithProviders(<Home />, { rol: 'INSPECTOR' })

    expect(screen.getByText('Inspector')).toBeInTheDocument()
    expect(screen.getAllByText('Registrar asistencia').length).toBeGreaterThan(0)
    expect(screen.queryByText('Registrar anotacion')).not.toBeInTheDocument()
  })

  it('Home muestra permisos de profesor', () => {
    renderWithProviders(<Home />, { rol: 'PROFESOR' })

    expect(screen.getByText('Profesor')).toBeInTheDocument()
    expect(screen.getByText('Puede registrar anotaciones')).toBeInTheDocument()
    expect(screen.getAllByText('Registrar anotacion').length).toBeGreaterThan(0)
  })

  it('PerfilEstudiante carga perfil para alumno vinculado', async () => {
    apiMocks.getPerfilEstudiante.mockResolvedValue(perfilDemo)
    localStorage.setItem('authUser', JSON.stringify({
      id: 2,
      nombreUsuario: 'alumno1',
      email: 'alumno1@colegio.cl',
      rol: 'ALUMNO',
      estudianteId: 1,
    }))
    localStorage.setItem('rolActual', 'ALUMNO')

    renderWithProviders(<PerfilEstudiante />, { rol: 'ALUMNO', estudianteId: 1 })

    expect(await screen.findByText('Cristobal Huinca Aravena')).toBeInTheDocument()
    expect(apiMocks.getPerfilEstudiante).toHaveBeenCalledWith(1)
  })

  it('PerfilEstudiante busca por RUT y muestra datos completos', async () => {
    apiMocks.getPerfilEstudiantePorRut.mockResolvedValue(perfilDemo)
    renderWithProviders(<PerfilEstudiante />)

    fireEvent.change(screen.getByLabelText(/buscar por/i), { target: { value: 'rut' } })
    fireEvent.change(screen.getByLabelText(/rut estudiante/i), { target: { value: '21827564-8' } })
    fireEvent.click(screen.getByRole('button', { name: /buscar perfil/i }))

    expect(await screen.findByText('Cristobal Huinca Aravena')).toBeInTheDocument()
    expect(screen.getByText('2 Medio')).toBeInTheDocument()
    expect(apiMocks.getPerfilEstudiantePorRut).toHaveBeenCalledWith('21827564-8')
  })

  it('AnotacionDetalle valida busqueda por RUT vacio', () => {
    renderWithProviders(<AnotacionDetalle />)

    fireEvent.change(screen.getByLabelText(/buscar por/i), { target: { value: 'rut' } })
    fireEvent.submit(screen.getByRole('button', { name: /buscar anotaciones/i }).closest('form'))

    expect(screen.getByText('Debe ingresar el RUT del estudiante.')).toBeInTheDocument()
  })

  it('AnotacionDetalle lista anotaciones del estudiante', async () => {
    apiMocks.getPerfilEstudiante.mockResolvedValue(perfilDemo)
    renderWithProviders(<AnotacionDetalle />)

    fireEvent.click(screen.getByRole('button', { name: /buscar anotaciones/i }))

    expect(await screen.findByText('Anotaciones registradas (1)')).toBeInTheDocument()
    expect(screen.getByText('Participa activamente')).toBeInTheDocument()
    expect(apiMocks.getPerfilEstudiante).toHaveBeenCalledWith('1')
  })

  it('AsistenciaDetalle lista asistencias del estudiante', async () => {
    apiMocks.getPerfilEstudiante.mockResolvedValue(perfilDemo)
    renderWithProviders(<AsistenciaDetalle />)

    fireEvent.click(screen.getByRole('button', { name: /buscar asistencia/i }))

    expect(await screen.findByText('Asistencias registradas (1)')).toBeInTheDocument()
    expect(screen.getByText('PRESENTE')).toBeInTheDocument()
  })

  it('RegistrarAnotacion restringe acceso a alumno', () => {
    renderWithProviders(<RegistrarAnotacion />, { rol: 'ALUMNO' })

    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
    expect(screen.queryByText('Guardar anotacion')).not.toBeInTheDocument()
  })

  it('RegistrarAnotacion muestra validacion si falta descripcion', () => {
    renderWithProviders(<RegistrarAnotacion />)

    fireEvent.submit(screen.getByRole('button', { name: /guardar anotacion/i }).closest('form'))

    expect(screen.getByText('Debe ingresar una descripcion para la anotacion.')).toBeInTheDocument()
  })

  it('RegistrarAnotacion valida id estudiante y rut registrador', () => {
    renderWithProviders(<RegistrarAnotacion />)

    fireEvent.change(screen.getByLabelText(/id estudiante/i), { target: { value: '0' } })
    fireEvent.submit(screen.getByRole('button', { name: /guardar anotacion/i }).closest('form'))
    expect(screen.getByText('Debe ingresar un ID de estudiante valido.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/id estudiante/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/registrada por/i), { target: { value: '   ' } })
    fireEvent.submit(screen.getByRole('button', { name: /guardar anotacion/i }).closest('form'))
    expect(screen.getByText('Debe ingresar el RUT de quien registra.')).toBeInTheDocument()
  })

  it('RegistrarAnotacion muestra error si estudiante no existe', async () => {
    validarMocks.verificarEstudianteExiste.mockResolvedValue('No existe un estudiante registrado con el ID 99.')
    renderWithProviders(<RegistrarAnotacion />)

    fireEvent.change(screen.getByLabelText(/id estudiante/i), { target: { value: '99' } })
    fireEvent.change(screen.getByPlaceholderText(/participa activamente/i), {
      target: { value: 'Buen desempeño' },
    })
    fireEvent.click(screen.getByRole('button', { name: /guardar anotacion/i }))

    expect(await screen.findByText('No existe un estudiante registrado con el ID 99.')).toBeInTheDocument()
  })

  it('RegistrarAnotacion muestra error si falla el BFF', async () => {
    validarMocks.verificarEstudianteExiste.mockResolvedValue('')
    apiMocks.createAnotacion.mockRejectedValue(new Error('Error del servidor'))
    renderWithProviders(<RegistrarAnotacion />)

    fireEvent.change(screen.getByPlaceholderText(/participa activamente/i), {
      target: { value: 'Participa activamente' },
    })
    fireEvent.click(screen.getByRole('button', { name: /guardar anotacion/i }))

    expect(await screen.findByText('Error del servidor')).toBeInTheDocument()
  })

  it('RegistrarAnotacion envia datos y muestra exito', async () => {
    apiMocks.createAnotacion.mockResolvedValue({
      id: 10,
      estudianteId: 1,
      cursoId: 2,
      fecha: '2026-05-08',
      tipo: 'POSITIVA',
      descripcion: 'Participa activamente',
    })
    renderWithProviders(<RegistrarAnotacion />)

    fireEvent.change(screen.getByPlaceholderText(/participa activamente/i), {
      target: { value: 'Participa activamente' },
    })
    fireEvent.click(screen.getByRole('button', { name: /guardar anotacion/i }))

    expect(await screen.findByText('Anotacion registrada correctamente.')).toBeInTheDocument()
    expect(apiMocks.createAnotacion).toHaveBeenCalledWith(expect.objectContaining({
      estudianteId: 1,
      descripcion: 'Participa activamente',
    }))
  })

  it('RegistrarAsistencia valida rut de quien registra', () => {
    renderWithProviders(<RegistrarAsistencia />)

    fireEvent.change(screen.getByLabelText(/registrada por/i), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar asistencia/i }))

    expect(screen.getByText('Debe ingresar el RUT de quien registra.')).toBeInTheDocument()
  })

  it('RegistrarAsistencia muestra error si estudiante no existe', async () => {
    validarMocks.verificarEstudianteExiste.mockResolvedValue('No existe un estudiante registrado con el ID 99.')
    renderWithProviders(<RegistrarAsistencia />)

    fireEvent.change(screen.getByLabelText(/id estudiante/i), { target: { value: '99' } })
    fireEvent.click(screen.getByRole('button', { name: /guardar asistencia/i }))

    expect(await screen.findByText('No existe un estudiante registrado con el ID 99.')).toBeInTheDocument()
  })

  it('RegistrarAsistencia restringe acceso a alumno', () => {
    renderWithProviders(<RegistrarAsistencia />, { rol: 'ALUMNO' })

    expect(screen.getByText('Acceso restringido')).toBeInTheDocument()
  })

  it('RegistrarAsistencia envia datos y muestra exito', async () => {
    apiMocks.createAsistencia.mockResolvedValue({
      id: 20,
      estudianteId: 1,
      cursoId: 2,
      fecha: '2026-05-08',
      estado: 'PRESENTE',
      observacion: '',
    })
    renderWithProviders(<RegistrarAsistencia />)

    fireEvent.click(screen.getByRole('button', { name: /guardar asistencia/i }))

    await waitFor(() => expect(apiMocks.createAsistencia).toHaveBeenCalled())
    expect(screen.getByText('Asistencia registrada correctamente.')).toBeInTheDocument()
  })
})
