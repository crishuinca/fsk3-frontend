import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { RoleProvider } from './context/RoleContext'
import AnotacionDetalle from './pages/AnotacionDetalle'
import AsistenciaDetalle from './pages/AsistenciaDetalle'
import Home from './pages/Home'
import PerfilEstudiante from './pages/PerfilEstudiante'
import './styles/global.css'

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <Navbar />
        <main className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<PerfilEstudiante />} />
            <Route path="/anotacion" element={<AnotacionDetalle />} />
            <Route path="/asistencia" element={<AsistenciaDetalle />} />
          </Routes>
        </main>
      </BrowserRouter>
    </RoleProvider>
  )
}

export default App
