import { createContext } from 'react'

export const RoleContext = createContext()

export const roles = [
  { id: 'PROFESOR', label: 'Profesor' },
  { id: 'INSPECTOR', label: 'Inspector' },
  { id: 'APODERADO', label: 'Apoderado' },
]
