import { useState } from 'react'
import Badge from '../components/Badge'
import ErrorMessage from '../components/ErrorMessage'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import RoleGuard from '../components/RoleGuard'
import { getPerfilEstudiante, getPerfilEstudiantePorRut } from '../services/bffApi'

function AnotacionDetalle() {
  const [tipoBusqueda, setTipoBusqueda] = useState('id')
  const [estudianteId, setEstudianteId] = useState('1')
  const [rut, setRut] = useState('')
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function validarBusqueda() {
    if (tipoBusqueda === 'rut' && !rut.trim()) {
      return 'Debe ingresar el RUT del estudiante.'
    }
    if (tipoBusqueda === 'id' && (!estudianteId || Number(estudianteId) <= 0)) {
      return 'Debe ingresar un ID de estudiante valido.'
    }
    return ''
  }

  async function buscarAnotaciones(e) {
    e.preventDefault()
    setError('')

    const validationError = validarBusqueda()
    if (validationError) {
      setPerfil(null)
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const data = tipoBusqueda === 'rut'
        ? await getPerfilEstudiantePorRut(rut)
        : await getPerfilEstudiante(estudianteId)
      setPerfil(data)
    } catch (ex) {
      setPerfil(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard
      permission="canViewAnotacion"
      fallback={
        <section className="page">
          <h1>Acceso restringido</h1>
          <p>El rol seleccionado no puede consultar anotaciones.</p>
        </section>
      }
    >
      <section className="page">
        <h1>Anotaciones del estudiante</h1>
        <p>Busca un estudiante por ID o RUT y revisa todo el detalle de sus anotaciones.</p>

        <form className="search-form" onSubmit={buscarAnotaciones}>
          <label>
            Buscar por
            <select value={tipoBusqueda} onChange={(e) => setTipoBusqueda(e.target.value)}>
              <option value="id">ID estudiante</option>
              <option value="rut">RUT estudiante</option>
            </select>
          </label>
          {tipoBusqueda === 'rut' ? (
            <label>
              RUT estudiante
              <input
                required
                placeholder="Ej: 21827564-8"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </label>
          ) : (
            <label>
              ID estudiante
              <input
                min="1"
                required
                type="number"
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
              />
            </label>
          )}
          <button type="submit">Buscar anotaciones</button>
        </form>

        {loading && <Loading />}
        <ErrorMessage message={error} />

        {perfil && (
          <div className="grid">
            <InfoCard title="Datos del estudiante">
              <Field label="ID estudiante" value={perfil.estudiante?.id} />
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

            <InfoCard title={`Anotaciones registradas (${perfil.anotaciones?.length || 0})`}>
              {perfil.anotaciones?.length ? (
                <ul className="list">
                  {perfil.anotaciones.map((item) => (
                    <li key={item.id}>
                      <Badge tone={item.tipo}>{item.tipo}</Badge>
                      <Field label="ID anotacion" value={item.id} />
                      <Field label="Fecha" value={item.fecha} />
                      <Field label="Descripcion" value={item.descripcion} />
                      <Field label="Registrada por" value={item.registradaPor} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sin anotaciones registradas.</p>
              )}
            </InfoCard>
          </div>
        )}
      </section>
    </RoleGuard>
  )
}

export default AnotacionDetalle
