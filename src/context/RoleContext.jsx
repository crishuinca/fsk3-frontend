import { useEffect, useState } from 'react'
import { RoleContext, roles } from './roleStore'

export function RoleProvider({ children }) {
  const [rol, setRol] = useState(() => localStorage.getItem('rolActual') || 'PROFESOR')

  useEffect(() => {
    localStorage.setItem('rolActual', rol)
  }, [rol])

  return (
    <RoleContext.Provider value={{ rol, setRol, roles }}>
      {children}
    </RoleContext.Provider>
  )
}
