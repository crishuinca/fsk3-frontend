import { useState } from 'react'
import Badge from '../components/Badge'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import RoleGuard from '../components/RoleGuard'
import { createAnotacion } from '../services/bffApi'

const today = new Date().toISOString().slice(0, 10)

function RegistrarAnotacion() {
  const [form, setForm] = useState({
    estudianteId: '1',
    fecha: today,
    tipo: 'POSITIVA',
    descripcion: '',
    registradaPor: '12345678-9',
  })
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function registrarAnotacion(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await createAnotacion({
        ...form,
        estudianteId: Number(form.estudianteId),
      })
      setResultado(data)
      setForm((current) => ({ ...current, descripcion: '' }))
    } catch (ex) {
      setResultado(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard
      permission="canCreateAnotacion"
      fallback={
        <section className="page">
          <h1>Acceso restringido</h1>
          <p>El rol seleccionado puede consultar anotaciones, pero no registrar nuevas.</p>
        </section>
      }
    >
      <section className="page">
        <h1>Registrar anotacion</h1>
        <p>Formulario para que el profesor registre una anotacion positiva o negativa.</p>

        <form className="data-form" onSubmit={registrarAnotacion}>
          <label>
            ID estudiante
            <input
              min="1"
              required
              type="number"
              value={form.estudianteId}
              onChange={(e) => updateField('estudianteId', e.target.value)}
            />
          </label>
          <label>
            Fecha
            <input
              required
              type="date"
              value={form.fecha}
              onChange={(e) => updateField('fecha', e.target.value)}
            />
          </label>
          <label>
            Tipo
            <select value={form.tipo} onChange={(e) => updateField('tipo', e.target.value)}>
              <option value="POSITIVA">POSITIVA</option>
              <option value="NEGATIVA">NEGATIVA</option>
            </select>
          </label>
          <label>
            Registrada por
            <input
              required
              value={form.registradaPor}
              onChange={(e) => updateField('registradaPor', e.target.value)}
            />
          </label>
          <label className="form-full">
            Descripcion
            <textarea
              required
              rows="4"
              value={form.descripcion}
              onChange={(e) => updateField('descripcion', e.target.value)}
              placeholder="Ej: Participa activamente en clases"
            />
          </label>
          <button type="submit">Guardar anotacion</button>
        </form>

        {loading && <Loading />}
        <ErrorMessage message={error} />

        {resultado && (
          <InfoCard title="Anotacion registrada">
            <Badge tone={resultado.tipo}>{resultado.tipo}</Badge>
            <Field label="ID anotacion" value={resultado.id} />
            <Field label="ID estudiante" value={resultado.estudianteId} />
            <Field label="ID curso" value={resultado.cursoId} />
            <Field label="Fecha" value={resultado.fecha} />
            <Field label="Descripcion" value={resultado.descripcion} />
          </InfoCard>
        )}
      </section>
    </RoleGuard>
  )
}

export default RegistrarAnotacion
