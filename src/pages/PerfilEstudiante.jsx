import { useState } from 'react'
import Badge from '../components/Badge'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import RoleGuard from '../components/RoleGuard'
import { useRole } from '../hooks/useRole'
import { getPerfilEstudiante } from '../services/bffApi'

function PerfilEstudiante() {
  const { currentRole } = useRole()
  const [estudianteId, setEstudianteId] = useState('1')
  const [cursoId, setCursoId] = useState('1')
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function buscarPerfil(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await getPerfilEstudiante(estudianteId, cursoId)
      setPerfil(data)
    } catch (ex) {
      setPerfil(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <h1>Perfil de estudiante</h1>
      <p>Busca un estudiante y muestra sus datos junto con asistencias y anotaciones. Vista actual: {currentRole.label}.</p>

      <form className="search-form" onSubmit={buscarPerfil}>
        <label>
          ID estudiante
          <input value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)} />
        </label>
        <label>
          ID curso
          <input value={cursoId} onChange={(e) => setCursoId(e.target.value)} />
        </label>
        <button type="submit">Buscar perfil</button>
      </form>

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {perfil && (
        <>
          <div className="summary-grid">
            <InfoCard title="Resumen">
              <div className="metric-row">
                <div><strong>{perfil.anotaciones?.length || 0}</strong><span>Anotaciones</span></div>
                <div><strong>{perfil.asistencias?.length || 0}</strong><span>Asistencias</span></div>
                <div><strong>{perfil.asistencias?.filter((item) => item.estado === 'AUSENTE').length || 0}</strong><span>Ausencias</span></div>
              </div>
            </InfoCard>
          </div>

          <div className="grid">
            <InfoCard title="Datos del estudiante">
              <Field label="ID" value={perfil.estudiante?.id} />
              <Field label="RUT" value={perfil.estudiante?.rut} />
              <Field label="Nombre completo" value={`${perfil.estudiante?.nombres || ''} ${perfil.estudiante?.apellidoPaterno || ''} ${perfil.estudiante?.apellidoMaterno || ''}`} />
              <Field label="Email" value={perfil.estudiante?.email} />
            </InfoCard>

            <InfoCard title="Curso actual">
              <Field label="ID curso" value={perfil.curso?.id} />
              <Field label="Nivel" value={perfil.curso?.nivel} />
              <Field label="Letra" value={perfil.curso?.letra} />
              <Field label="Año" value={perfil.curso?.anio} />
              <Field label="Profesor jefe" value={perfil.curso?.profesorJefeRut} />
            </InfoCard>

            <RoleGuard permission="canViewAnotacion">
              <InfoCard title="Anotaciones">
                {perfil.anotaciones?.length ? (
                  <ul className="list">
                    {perfil.anotaciones.map((item) => (
                      <li key={item.id}>
                        <Badge tone={item.tipo}>{item.tipo}</Badge> {item.descripcion}
                        <small>{item.fecha} - registrada por {item.registradaPor}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Sin anotaciones registradas.</p>
                )}
              </InfoCard>
            </RoleGuard>

            <RoleGuard permission="canViewAsistencia">
              <InfoCard title="Asistencias">
                {perfil.asistencias?.length ? (
                  <ul className="list">
                    {perfil.asistencias.map((item) => (
                      <li key={item.id}>
                        <Badge tone={item.estado}>{item.estado}</Badge> {item.fecha}
                        <small>{item.observacion || 'Sin observacion'}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Sin asistencias registradas.</p>
                )}
              </InfoCard>
            </RoleGuard>
          </div>
        </>
      )}
    </section>
  )
}

export default PerfilEstudiante
