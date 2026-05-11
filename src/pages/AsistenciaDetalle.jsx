import { useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import { getAsistenciaDetalle } from '../services/bffApi'

function AsistenciaDetalle() {
  const [id, setId] = useState('1')
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function buscarDetalle(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await getAsistenciaDetalle(id)
      setDetalle(data)
    } catch (ex) {
      setDetalle(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <h1>Detalle de asistencia</h1>
      <p>Consulta una asistencia y muestra los datos relacionados del estudiante y curso.</p>

      <form className="search-form" onSubmit={buscarDetalle}>
        <label>
          ID asistencia
          <input value={id} onChange={(e) => setId(e.target.value)} />
        </label>
        <button type="submit">Buscar asistencia</button>
      </form>

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {detalle && (
        <div className="grid">
          <InfoCard title="Asistencia">
            <Field label="Fecha" value={detalle.asistencia?.fecha} />
            <Field label="Estado" value={detalle.asistencia?.estado} />
            <Field label="Observacion" value={detalle.asistencia?.observacion || 'Sin observacion'} />
          </InfoCard>

          <InfoCard title="Estudiante">
            <Field label="RUT" value={detalle.estudiante?.rut} />
            <Field label="Nombre" value={`${detalle.estudiante?.nombres || ''} ${detalle.estudiante?.apellidoPaterno || ''}`} />
          </InfoCard>

          <InfoCard title="Curso">
            <Field label="Nivel" value={detalle.curso?.nivel} />
            <Field label="Letra" value={detalle.curso?.letra} />
            <Field label="Año" value={detalle.curso?.anio} />
          </InfoCard>
        </div>
      )}
    </section>
  )
}

export default AsistenciaDetalle
