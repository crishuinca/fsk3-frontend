import { Link } from 'react-router-dom'
import InfoCard from '../components/InfoCard'
import { API_URL } from '../services/bffApi'

function Home() {
  return (
    <section className="page">
      <div className="hero-panel">
        <p className="eyebrow">Colegio Bernardo O'Higgins</p>
        <h1>Plataforma de libro de clases digital</h1>
        <p>
          Bienvenido al sistema de libro de clases digital del Colegio Bernardo O'Higgins.
        </p>
      </div>

      <div className="grid">
        <InfoCard title="Perfil del estudiante">
          <p>Obtiene el perfil completo del estudiante, incluyendo sus datos, curso, anotaciones y asistencias.</p>
          <Link className="button" to="/perfil">Ver perfil</Link>
        </InfoCard>

        <InfoCard title="Detalle de anotacion">
          <p>Obtiene el detalle de una anotacion, incluyendo los datos del estudiante y su curso.</p>
          <Link className="button" to="/anotacion">Ver anotacion</Link>
        </InfoCard>

        <InfoCard title="Detalle de asistencia">
          <p>Obtiene el detalle de una asistencia, incluyendo los datos del estudiante y su curso.</p>
          <Link className="button" to="/asistencia">Ver asistencia</Link>
        </InfoCard>
      </div>

      
    </section>
  )
}

export default Home
