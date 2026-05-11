import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navItems } from '../context/roleStore'
import { useRole } from '../hooks/useRole'
import RoleSelector from './RoleSelector'

function Navbar() {
  const { hasPermission } = useRole()

  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        <img className="brand-logo" src={logo} alt="Logo Colegio Bernardo O'Higgins" />
        Colegio Bernardo O'Higgins
      </NavLink>

      <nav className="nav-links" aria-label="Navegacion principal">
        {navItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
      </nav>

      <RoleSelector />
    </header>
  )
}

export default Navbar
