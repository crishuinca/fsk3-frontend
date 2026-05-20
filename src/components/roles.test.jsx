import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import RoleGuard from './RoleGuard'
import { AuthProvider } from '../context/AuthContext'
import { permissionsByRole, roles } from '../context/roleStore'

function renderRole(ui, rol = 'PROFESOR') {
  const user = {
    id: 1,
    nombreUsuario: 'usuario.test',
    email: 'usuario.test@colegio.cl',
    rol,
  }

  localStorage.setItem('authToken', 'token.test')
  localStorage.setItem('authUser', JSON.stringify(user))
  localStorage.setItem('rolActual', rol)

  return render(
    <AuthProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthProvider>,
  )
}

describe('roles y permisos', () => {
  it('define los roles del sistema con minimo privilegio', () => {
    expect(roles.map((item) => item.id)).toContain('ADMIN')
    expect(roles.map((item) => item.id)).toContain('PROFESOR')
    expect(permissionsByRole.PROFESOR.canCreateAnotacion).toBe(true)
    expect(permissionsByRole.INSPECTOR.canCreateAnotacion).toBe(false)
    expect(permissionsByRole.INSPECTOR.canCreateUsers).toBe(true)
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

  it('Navbar muestra crear usuario solo para inspector', () => {
    renderRole(<Navbar />, 'INSPECTOR')

    expect(screen.getByText('Crear usuario')).toBeInTheDocument()
  })

  it('Navbar cierra sesion y limpia almacenamiento', () => {
    renderRole(<Navbar />, 'PROFESOR')

    fireEvent.click(screen.getByRole('button', { name: /cerrar sesion/i }))

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('authUser')).toBeNull()
  })
})
