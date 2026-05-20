import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

function BusquedaPerfilForm({
  descripcion,
  esAlumno,
  estudianteIdVinculado,
  tipoBusqueda,
  setTipoBusqueda,
  estudianteId,
  setEstudianteId,
  rut,
  setRut,
  loading,
  error,
  onSubmit,
  botonLabel,
  authLoading = false,
}) {
  if (esAlumno) {
    return (
      <div className="alumno-panel form-full">
        <p className="eyebrow">Mis datos</p>
        <h2>Perfil vinculado</h2>
        <p>
          Como alumno solo puede ver la informacion de su ID de estudiante
          {estudianteIdVinculado ? ` (${estudianteIdVinculado})` : ''}.
        </p>
        {authLoading || loading ? <Loading /> : null}
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <>
      <p>{descripcion}</p>
      <form className="search-form" onSubmit={onSubmit}>
        <label>
          Buscar por
          <select value={tipoBusqueda} onChange={(event) => setTipoBusqueda(event.target.value)}>
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
              onChange={(event) => setRut(event.target.value)}
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
              onChange={(event) => setEstudianteId(event.target.value)}
            />
          </label>
        )}
        <button type="submit">{botonLabel}</button>
      </form>
        {authLoading || loading ? <Loading /> : null}
        <ErrorMessage message={error} />
    </>
  )
}

export default BusquedaPerfilForm
