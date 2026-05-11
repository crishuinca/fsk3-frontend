import { useState } from 'react'
import Badge from '../components/Badge'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import RoleGuard from '../components/RoleGuard'
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
    <RoleGuard
      permission="canViewAnotacionDetalle"
      fallback={
        <section className="page">
          <h1>Acceso restringido</h1>
          <p>El rol seleccionado puede revisar anotaciones desde el perfil del estudiante, pero no accede a esta busqueda directa.</p>
        </section>
      }
    >
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
            <Badge tone={detalle.anotacion?.tipo}>{detalle.anotacion?.tipo}</Badge>
            <Field label="ID anotacion" value={detalle.anotacion?.id} />
            <Field label="Fecha" value={detalle.anotacion?.fecha} />
            <Field label="Descripcion" value={detalle.anotacion?.descripcion} />
            <Field label="Registrada por" value={detalle.anotacion?.registradaPor} />
          </InfoCard>

          <InfoCard title="Datos del estudiante">
            <Field label="ID estudiante" value={detalle.estudiante?.id} />
            <Field label="RUT" value={detalle.estudiante?.rut} />
            <Field label="Nombre completo" value={`${detalle.estudiante?.nombres || ''} ${detalle.estudiante?.apellidoPaterno || ''} ${detalle.estudiante?.apellidoMaterno || ''}`} />
            <Field label="Email" value={detalle.estudiante?.email} />
          </InfoCard>

          <InfoCard title="Curso relacionado">
            <Field label="ID curso" value={detalle.curso?.id} />
            <Field label="Nivel" value={detalle.curso?.nivel} />
            <Field label="Letra" value={detalle.curso?.letra} />
            <Field label="Año" value={detalle.curso?.anio} />
            <Field label="Profesor jefe" value={detalle.curso?.profesorJefeRut} />
          </InfoCard>
        </div>
      )}
      </section>
    </RoleGuard>
  )
}

export default AnotacionDetalle
