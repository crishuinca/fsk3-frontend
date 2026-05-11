import { useState } from 'react'
import Badge from '../components/Badge'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import RoleGuard from '../components/RoleGuard'
import { createAsistencia } from '../services/bffApi'

const today = new Date().toISOString().slice(0, 10)

function RegistrarAsistencia() {
  const [form, setForm] = useState({
    cursoId: '1',
    estudianteId: '1',
    fecha: today,
    estado: 'PRESENTE',
    observacion: '',
    registradaPor: '12345678-9',
  })
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function registrarAsistencia(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await createAsistencia({
        ...form,
        cursoId: Number(form.cursoId),
        estudianteId: Number(form.estudianteId),
      })
      setResultado(data)
      setForm((current) => ({ ...current, observacion: '' }))
    } catch (ex) {
      setResultado(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard
      permission="canCreateAsistencia"
      fallback={
        <section className="page">
          <h1>Acceso restringido</h1>
          <p>El rol seleccionado puede consultar asistencia, pero no registrar nuevos estados.</p>
        </section>
      }
    >
      <section className="page">
        <h1>Registrar asistencia</h1>
        <p>Formulario para que profesor o inspector registren la asistencia diaria de un estudiante.</p>

        <form className="data-form" onSubmit={registrarAsistencia}>
          <label>
            ID curso
            <input
              min="1"
              required
              type="number"
              value={form.cursoId}
              onChange={(e) => updateField('cursoId', e.target.value)}
            />
          </label>
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
            Estado
            <select value={form.estado} onChange={(e) => updateField('estado', e.target.value)}>
              <option value="PRESENTE">PRESENTE</option>
              <option value="AUSENTE">AUSENTE</option>
              <option value="ATRASADO">ATRASADO</option>
              <option value="JUSTIFICADO">JUSTIFICADO</option>
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
            Observacion
            <textarea
              rows="4"
              value={form.observacion}
              onChange={(e) => updateField('observacion', e.target.value)}
              placeholder="Ej: Llego 10 minutos tarde"
            />
          </label>
          <button type="submit">Guardar asistencia</button>
        </form>

        {loading && <Loading />}
        <ErrorMessage message={error} />

        {resultado && (
          <InfoCard title="Asistencia registrada">
            <Badge tone={resultado.estado}>{resultado.estado}</Badge>
            <Field label="ID asistencia" value={resultado.id} />
            <Field label="ID estudiante" value={resultado.estudianteId} />
            <Field label="ID curso" value={resultado.cursoId} />
            <Field label="Fecha" value={resultado.fecha} />
            <Field label="Observacion" value={resultado.observacion || 'Sin observacion'} />
          </InfoCard>
        )}
      </section>
    </RoleGuard>
  )
}

export default RegistrarAsistencia
