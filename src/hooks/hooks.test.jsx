import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../context/authStore'
import { RoleContext } from '../context/roleStore'
import { useAuth } from './useAuth'
import { useRole } from './useRole'

function AuthProbe() {
  useAuth()
  return <p>auth ok</p>
}

function RoleProbe() {
  useRole()
  return <p>role ok</p>
}

describe('hooks de contexto', () => {
  it('useAuth exige AuthProvider', () => {
    expect(() => render(<AuthProbe />)).toThrow(/AuthProvider/i)
  })

  it('useRole exige RoleProvider', () => {
    expect(() => render(<RoleProbe />)).toThrow(/RoleProvider/i)
  })

  it('useAuth y useRole funcionan con provider', () => {
    const authValue = {
      token: 't',
      user: { nombreUsuario: 'test' },
      loading: false,
      isAuthenticated: true,
      login: () => {},
      logout: () => {},
    }
    const roleValue = {
      rol: 'PROFESOR',
      setRol: () => {},
      roles: [],
      currentRole: { id: 'PROFESOR', label: 'Profesor' },
      permissions: {},
      hasPermission: () => true,
    }

    function Both() {
      const auth = useAuth()
      const role = useRole()
      return (
        <p>
          {auth.user.nombreUsuario}-{role.currentRole.label}
        </p>
      )
    }

    render(
      <AuthContext.Provider value={authValue}>
        <RoleContext.Provider value={roleValue}>
          <Both />
        </RoleContext.Provider>
      </AuthContext.Provider>,
    )

    expect(screen.getByText('test-Profesor')).toBeInTheDocument()
  })
})
