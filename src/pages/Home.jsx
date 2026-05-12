import { Link } from 'react-router-dom'
import InfoCard from '../components/InfoCard'
import RoleGuard from '../components/RoleGuard'
import { useRole } from '../hooks/useRole'

function Home() {
  const { currentRole, permissions } = useRole()

  return (
    <section className="page">
      <div className="hero-panel">
        <p className="eyebrow">Colegio Bernardo O'Higgins</p>
        <h1>Plataforma de libro de clases digital</h1>
        <p>
          Bienvenido al sistema de libro de clases digital del Colegio Bernardo O'Higgins.
        </p>
      </div>

      <div className="role-summary">
        <div>
          <span>Rol activo</span>
          <strong>{currentRole.label}</strong>
          <p>{currentRole.description}</p>
        </div>
        <ul>
          <li>{permissions.canViewPerfil ? 'Puede ver perfil de estudiante' : 'No puede ver perfiles'}</li>
          <li>{permissions.canCreateAnotacion ? 'Puede registrar anotaciones' : 'No registra anotaciones'}</li>
          <li>{permissions.canCreateAsistencia ? 'Puede registrar asistencia' : 'Solo consulta asistencia'}</li>
        </ul>
      </div>

      <div className="grid">
        <RoleGuard permission="canViewPerfil">
          <InfoCard title="Perfil del estudiante">
            <p>Obtiene el perfil completo del estudiante, incluyendo sus datos, curso, anotaciones y asistencias.</p>
            <Link className="button" to="/perfil">Ver perfil</Link>
          </InfoCard>
        </RoleGuard>

        <RoleGuard permission="canViewAnotacion">
          <InfoCard title="Anotaciones del estudiante">
            <p>Busca un estudiante por ID o RUT y revisa el detalle de sus anotaciones.</p>
            <Link className="button" to="/anotacion">Ver anotaciones</Link>
          </InfoCard>
        </RoleGuard>

        <RoleGuard permission="canViewAsistencia">
          <InfoCard title="Asistencia del estudiante">
            <p>Busca un estudiante por ID o RUT y revisa el detalle de su asistencia.</p>
            <Link className="button" to="/asistencia">Ver asistencia</Link>
          </InfoCard>
        </RoleGuard>

        <RoleGuard permission="canCreateAnotacion">
          <InfoCard title="Registrar anotacion">
            <p>Permite registrar una anotacion positiva o negativa para un estudiante.</p>
            <Link className="button" to="/registrar-anotacion">Registrar anotacion</Link>
          </InfoCard>
        </RoleGuard>

        <RoleGuard permission="canCreateAsistencia">
          <InfoCard title="Registrar asistencia">
            <p>Permite registrar asistencia, atraso, ausencia o justificacion diaria.</p>
            <Link className="button" to="/registrar-asistencia">Registrar asistencia</Link>
          </InfoCard>
        </RoleGuard>
      </div>

    </section>
  )
}

export default Home
