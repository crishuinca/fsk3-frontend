import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import ErrorMessage from '../components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'
import '../styles/login.css'

function Login() {
  const { login, isAuthenticated, loading, user } = useAuth()
  const [identificador, setIdentificador] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!loading && isAuthenticated) {
    return <Navigate to={user?.rol === 'ALUMNO' ? '/perfil' : '/'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!identificador.trim() || !password.trim()) {
      setError('Debe ingresar usuario o correo y contrasena.')
      return
    }

    setSubmitting(true)
    try {
      await login(identificador.trim(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo" src={logo} alt="Logo Colegio Bernardo O'Higgins" />
          <p className="eyebrow">Colegio Bernardo O'Higgins</p>
          <h1>Inicio de sesion</h1>
          <p>Ingrese su usuario o correo y contrasena para acceder al libro de clases digital.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario o correo
            <input
              type="text"
              value={identificador}
              onChange={(event) => setIdentificador(event.target.value)}
              placeholder="usuario o correo@colegio.cl"
              autoComplete="username"
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingrese su contrasena"
              autoComplete="current-password"
            />
          </label>

          {error ? <ErrorMessage message={error} /> : null}

          <button className="button login-button" type="submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login
