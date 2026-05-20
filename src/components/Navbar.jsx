import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navItems } from '../context/roleStore'
import { useAuth } from '../hooks/useAuth'
import { useRole } from '../hooks/useRole'

function Navbar() {
  const { hasPermission, currentRole } = useRole()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

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

      <div className="user-panel">
        
        <strong>{user?.nombreUsuario || 'Usuario'}</strong>
        <small>{currentRole.label}</small>
        <button className="logout-button" type="button" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>
    </header>
  )
}

export default Navbar
