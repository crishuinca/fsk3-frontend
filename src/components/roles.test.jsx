import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import RoleGuard from './RoleGuard'
import RoleSelector from './RoleSelector'
import { RoleProvider } from '../context/RoleContext'
import { permissionsByRole, roles } from '../context/roleStore'

function renderRole(ui, rol = 'PROFESOR') {
  localStorage.setItem('rolActual', rol)
  return render(
    <RoleProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </RoleProvider>,
  )
}

describe('roles y permisos', () => {
  it('define los cuatro roles principales del sistema', () => {
    expect(roles.map((rol) => rol.id)).toEqual(['PROFESOR', 'INSPECTOR', 'APODERADO', 'ALUMNO'])
    expect(permissionsByRole.PROFESOR.canCreateAnotacion).toBe(true)
    expect(permissionsByRole.INSPECTOR.canCreateAnotacion).toBe(false)
    expect(permissionsByRole.ALUMNO.canViewPerfil).toBe(true)
  })

  it('RoleGuard muestra contenido solo cuando el rol tiene permiso', () => {
    renderRole(
      <RoleGuard permission="canCreateAnotacion" fallback={<p>Sin permiso</p>}>
        <p>Puede registrar</p>
      </RoleGuard>,
      'INSPECTOR',
    )

    expect(screen.getByText('Sin permiso')).toBeInTheDocument()
    expect(screen.queryByText('Puede registrar')).not.toBeInTheDocument()
  })

  it('Navbar oculta acciones que el alumno no puede ejecutar', () => {
    renderRole(<Navbar />, 'ALUMNO')

    expect(screen.getByText('Perfil estudiante')).toBeInTheDocument()
    expect(screen.queryByText('Registrar anotacion')).not.toBeInTheDocument()
    expect(screen.queryByText('Registrar asistencia')).not.toBeInTheDocument()
  })

  it('RoleSelector cambia el rol activo', () => {
    renderRole(<RoleSelector />, 'PROFESOR')

    fireEvent.change(screen.getByLabelText(/rol actual/i), { target: { value: 'INSPECTOR' } })

    expect(screen.getByText(/Se enfoca en asistencia/i)).toBeInTheDocument()
    expect(localStorage.getItem('rolActual')).toBe('INSPECTOR')
  })
})
