import { NavLink } from 'react-router-dom'
import RoleSelector from './RoleSelector'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        Libro de Clases Digital
      </NavLink>

      <nav className="nav-links" aria-label="Navegacion principal">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/perfil">Perfil estudiante</NavLink>
        <NavLink to="/anotacion">Anotacion</NavLink>
        <NavLink to="/asistencia">Asistencia</NavLink>
      </nav>

      <RoleSelector />
    </header>
  )
}

export default Navbar
