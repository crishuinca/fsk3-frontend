import { useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import { getPerfilEstudiante } from '../services/bffApi'

function PerfilEstudiante() {
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
      <p>Busca un estudiante y muestra sus datos junto con asistencias y anotaciones.</p>

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
        <div className="grid">
          <InfoCard title="Estudiante">
            <Field label="RUT" value={perfil.estudiante?.rut} />
            <Field label="Nombre" value={`${perfil.estudiante?.nombres || ''} ${perfil.estudiante?.apellidoPaterno || ''} ${perfil.estudiante?.apellidoMaterno || ''}`} />
            <Field label="Email" value={perfil.estudiante?.email} />
          </InfoCard>

          <InfoCard title="Curso">
            <Field label="Nivel" value={perfil.curso?.nivel} />
            <Field label="Letra" value={perfil.curso?.letra} />
            <Field label="Año" value={perfil.curso?.anio} />
          </InfoCard>

          <InfoCard title="Anotaciones">
            {perfil.anotaciones?.length ? (
              <ul className="list">
                {perfil.anotaciones.map((item) => (
                  <li key={item.id}>
                    <strong>{item.tipo}</strong> - {item.descripcion}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin anotaciones registradas.</p>
            )}
          </InfoCard>

          <InfoCard title="Asistencias">
            {perfil.asistencias?.length ? (
              <ul className="list">
                {perfil.asistencias.map((item) => (
                  <li key={item.id}>
                    <strong>{item.fecha}</strong> - {item.estado}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sin asistencias registradas.</p>
            )}
          </InfoCard>
        </div>
      )}
    </section>
  )
}

export default PerfilEstudiante
