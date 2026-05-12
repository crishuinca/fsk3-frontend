import { useContext } from 'react'
import { RoleContext } from '../context/roleStore'

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole debe usarse dentro de RoleProvider')
  }
  return context
}
