import { useEffect, useState } from 'react'
import { permissionsByRole, RoleContext, roles } from './roleStore'

export function RoleProvider({ children }) {
  const [rol, setRol] = useState(() => localStorage.getItem('rolActual') || 'PROFESOR')
  const currentRole = roles.find((item) => item.id === rol) || roles[0]
  const permissions = permissionsByRole[rol] || permissionsByRole.PROFESOR
  const hasPermission = (permission) => !permission || Boolean(permissions[permission])

  useEffect(() => {
    localStorage.setItem('rolActual', rol)
  }, [rol])

  return (
    <RoleContext.Provider value={{ rol, setRol, roles, currentRole, permissions, hasPermission }}>
      {children}
    </RoleContext.Provider>
  )
}
