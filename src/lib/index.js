import '../styles/global.css'

export { default as LibroClasesApp } from '../App'

export { default as Badge } from '../components/Badge'
export { default as ErrorMessage } from '../components/ErrorMessage'
export { default as Field } from '../components/Field'
export { default as InfoCard } from '../components/InfoCard'
export { default as Loading } from '../components/Loading'
export { default as Navbar } from '../components/Navbar'
export { default as RoleGuard } from '../components/RoleGuard'
export { default as RoleSelector } from '../components/RoleSelector'

export { RoleProvider } from '../context/RoleContext'
export { RoleContext, navItems, permissionsByRole, roles } from '../context/roleStore'
export { useRole } from '../hooks/useRole'

export { default as AnotacionDetalle } from '../pages/AnotacionDetalle'
export { default as AsistenciaDetalle } from '../pages/AsistenciaDetalle'
export { default as Home } from '../pages/Home'
export { default as PerfilEstudiante } from '../pages/PerfilEstudiante'
export { default as RegistrarAnotacion } from '../pages/RegistrarAnotacion'
export { default as RegistrarAsistencia } from '../pages/RegistrarAsistencia'

export {
  API_URL,
  createAnotacion,
  createAsistencia,
  getAnotacionDetalle,
  getAsistenciaDetalle,
  getPerfilEstudiante,
  getPerfilEstudiantePorRut,
} from '../services/bffApi'
