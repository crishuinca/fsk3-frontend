import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BusquedaPerfilForm from './BusquedaPerfilForm'

describe('BusquedaPerfilForm', () => {
  const baseProps = {
    descripcion: 'Busca un estudiante',
    esAlumno: false,
    estudianteIdVinculado: null,
    tipoBusqueda: 'id',
    setTipoBusqueda: vi.fn(),
    estudianteId: '1',
    setEstudianteId: vi.fn(),
    rut: '',
    setRut: vi.fn(),
    loading: false,
    error: '',
    onSubmit: vi.fn((event) => event.preventDefault()),
    botonLabel: 'Buscar',
  }

  it('muestra formulario por ID para roles no alumno', () => {
    render(<BusquedaPerfilForm {...baseProps} />)

    expect(screen.getByText('Busca un estudiante')).toBeInTheDocument()
    expect(screen.getByLabelText(/id estudiante/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/buscar por/i), { target: { value: 'rut' } })
    expect(baseProps.setTipoBusqueda).toHaveBeenCalledWith('rut')
  })

  it('cambia a campo RUT cuando tipoBusqueda es rut', () => {
    render(<BusquedaPerfilForm {...baseProps} tipoBusqueda="rut" />)

    expect(screen.getByLabelText(/rut estudiante/i)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/rut estudiante/i), { target: { value: '1-9' } })
    expect(baseProps.setRut).toHaveBeenCalledWith('1-9')
  })

  it('muestra panel de alumno con ID vinculado y error', () => {
    render(
      <BusquedaPerfilForm
        {...baseProps}
        esAlumno
        estudianteIdVinculado={5}
        error="Sin datos"
        loading
        authLoading
      />,
    )

    expect(screen.getByText(/Perfil vinculado/i)).toBeInTheDocument()
    expect(screen.getByText(/\(5\)/)).toBeInTheDocument()
    expect(screen.getAllByText(/Cargando informacion/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
  })

  it('envia formulario al hacer submit', () => {
    const onSubmit = vi.fn((event) => event.preventDefault())
    render(<BusquedaPerfilForm {...baseProps} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
