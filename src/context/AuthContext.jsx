import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, login as loginRequest } from '../services/authApi'
import { permissionsByRole, RoleContext, roles } from './roleStore'

export const AuthContext = createContext()

const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  const rol = user?.rol || null
  const currentRole = roles.find((item) => item.id === rol) || roles[0]
  const permissions = permissionsByRole[rol] || {}
  const hasPermission = (permission) => !permission || Boolean(permissions[permission])

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    localStorage.setItem('rolActual', nextUser.rol)
  }, [])

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem('rolActual')
  }, [])

  const login = async (identificador, password) => {
    const response = await loginRequest(identificador, password)
    persistSession(response.token, response.usuario)
    return response
  }

  const logout = () => {
    clearSession()
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function validarSesion() {
      try {
        const usuario = await getCurrentUser(token)
        if (!cancelled) {
          persistSession(token, usuario)
        }
      } catch {
        if (!cancelled) {
          clearSession()
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    validarSesion()

    return () => {
      cancelled = true
    }
  }, [token, persistSession, clearSession])

  const roleValue = useMemo(
    () => ({ rol, setRol: () => {}, roles, currentRole, permissions, hasPermission }),
    [rol, currentRole, permissions],
  )

  const authValue = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, loading],
  )

  return (
    <AuthContext.Provider value={authValue}>
      <RoleContext.Provider value={roleValue}>{children}</RoleContext.Provider>
    </AuthContext.Provider>
  )
}
