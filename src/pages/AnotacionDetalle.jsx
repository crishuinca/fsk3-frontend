import { useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import { getAnotacionDetalle } from '../services/bffApi'

function AnotacionDetalle() {
  const [id, setId] = useState('1')
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function buscarDetalle(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await getAnotacionDetalle(id)
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
      <h1>Detalle de anotacion</h1>
      <p>Consulta una anotacion y muestra los datos relacionados del estudiante y curso.</p>

      <form className="search-form" onSubmit={buscarDetalle}>
        <label>
          ID anotacion
          <input value={id} onChange={(e) => setId(e.target.value)} />
        </label>
        <button type="submit">Buscar anotacion</button>
      </form>

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {detalle && (
        <div className="grid">
          <InfoCard title="Anotacion">
            <Field label="Fecha" value={detalle.anotacion?.fecha} />
            <Field label="Tipo" value={detalle.anotacion?.tipo} />
            <Field label="Descripcion" value={detalle.anotacion?.descripcion} />
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

export default AnotacionDetalle
