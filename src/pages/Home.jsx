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
          Frontend en React que consume solamente el BFF. El BFF se encarga de
          consultar los microservicios de academico y asistencia.
        </p>
      </div>

      <div className="grid">
        <InfoCard title="Perfil del estudiante">
          <p>Consulta estudiante, curso, anotaciones y asistencias en una sola vista.</p>
          <Link className="button" to="/perfil">Ver perfil</Link>
        </InfoCard>

        <InfoCard title="Detalle de anotacion">
          <p>Obtiene una anotacion junto con los datos del estudiante y su curso.</p>
          <Link className="button" to="/anotacion">Ver anotacion</Link>
        </InfoCard>

        <InfoCard title="Detalle de asistencia">
          <p>Obtiene una asistencia junto con los datos del estudiante y su curso.</p>
          <Link className="button" to="/asistencia">Ver asistencia</Link>
        </InfoCard>
      </div>

      <p className="api-note">Base URL actual del BFF: <code>{API_URL}</code></p>
    </section>
  )
}

export default Home
