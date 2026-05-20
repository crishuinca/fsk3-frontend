import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AnotacionDetalle from './pages/AnotacionDetalle'
import AsistenciaDetalle from './pages/AsistenciaDetalle'
import CrearUsuario from './pages/CrearUsuario'
import Home from './pages/Home'
import Login from './pages/Login'
import PerfilEstudiante from './pages/PerfilEstudiante'
import RegistrarAnotacion from './pages/RegistrarAnotacion'
import RegistrarAsistencia from './pages/RegistrarAsistencia'
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/perfil" element={<PerfilEstudiante />} />
              <Route path="/anotacion" element={<AnotacionDetalle />} />
              <Route path="/asistencia" element={<AsistenciaDetalle />} />
              <Route path="/registrar-anotacion" element={<RegistrarAnotacion />} />
              <Route path="/registrar-asistencia" element={<RegistrarAsistencia />} />
              <Route path="/crear-usuario" element={<CrearUsuario />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
