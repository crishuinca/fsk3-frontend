import { createContext } from 'react'

export const RoleContext = createContext()

export const roles = [
  {
    id: 'PROFESOR',
    label: 'Profesor',
    description: 'Puede revisar informacion del estudiante y registrar situaciones academicas.',
  },
  {
    id: 'INSPECTOR',
    label: 'Inspector',
    description: 'Se enfoca en asistencia, atrasos y seguimiento de convivencia.',
  },
  {
    id: 'APODERADO',
    label: 'Apoderado',
    description: 'Tiene acceso de lectura para revisar informacion de su estudiante.',
  },
  {
    id: 'ALUMNO',
    label: 'Alumno',
    description: 'Consulta su propia informacion academica, asistencias y anotaciones.',
  },
]

export const permissionsByRole = {
  PROFESOR: {
    canViewPerfil: true,
    canViewAnotacion: true,
    canViewAsistencia: true,
    canViewAnotacionDetalle: true,
    canViewAsistenciaDetalle: true,
    canCreateAnotacion: true,
    canCreateAsistencia: true,
  },
  INSPECTOR: {
    canViewPerfil: true,
    canViewAnotacion: true,
    canViewAsistencia: true,
    canViewAnotacionDetalle: true,
    canViewAsistenciaDetalle: true,
    canCreateAnotacion: false,
    canCreateAsistencia: true,
  },
  APODERADO: {
    canViewPerfil: true,
    canViewAnotacion: true,
    canViewAsistencia: true,
    canViewAnotacionDetalle: false,
    canViewAsistenciaDetalle: false,
    canCreateAnotacion: false,
    canCreateAsistencia: false,
  },
  ALUMNO: {
    canViewPerfil: true,
    canViewAnotacion: true,
    canViewAsistencia: true,
    canViewAnotacionDetalle: false,
    canViewAsistenciaDetalle: false,
    canCreateAnotacion: false,
    canCreateAsistencia: false,
  },
}

export const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/perfil', label: 'Perfil estudiante', permission: 'canViewPerfil' },
  { to: '/anotacion', label: 'Anotacion', permission: 'canViewAnotacion' },
  { to: '/asistencia', label: 'Asistencia', permission: 'canViewAsistencia' },
  { to: '/registrar-anotacion', label: 'Registrar anotacion', permission: 'canCreateAnotacion' },
  { to: '/registrar-asistencia', label: 'Registrar asistencia', permission: 'canCreateAsistencia' },
]
