import Badge from '../components/Badge'
import BusquedaPerfilForm from '../components/BusquedaPerfilForm'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import RoleGuard from '../components/RoleGuard'
import { usePerfilEstudianteBusqueda } from '../hooks/usePerfilEstudianteBusqueda'

function AsistenciaDetalle() {
  const busqueda = usePerfilEstudianteBusqueda()

  return (
    <RoleGuard
      permission="canViewAsistencia"
      fallback={
        <section className="page">
          <h1>Acceso restringido</h1>
          <p>El rol seleccionado no puede consultar asistencia.</p>
        </section>
      }
    >
      <section className="page">
        <h1>Asistencia del estudiante</h1>

        <BusquedaPerfilForm
          descripcion="Busca un estudiante por ID o RUT y revisa todo el detalle de su asistencia."
          botonLabel="Buscar asistencia"
          onSubmit={busqueda.buscarPerfil}
          {...busqueda}
        />

        {busqueda.perfil && (
          <div className="grid">
            <InfoCard title="Datos del estudiante">
              <Field label="ID estudiante" value={busqueda.perfil.estudiante?.id} />
              <Field label="RUT" value={busqueda.perfil.estudiante?.rut} />
              <Field label="Nombre completo" value={`${busqueda.perfil.estudiante?.nombres || ''} ${busqueda.perfil.estudiante?.apellidoPaterno || ''} ${busqueda.perfil.estudiante?.apellidoMaterno || ''}`} />
              <Field label="Email" value={busqueda.perfil.estudiante?.email} />
            </InfoCard>

            <InfoCard title="Curso actual">
              <Field label="ID curso" value={busqueda.perfil.curso?.id} />
              <Field label="Nivel" value={busqueda.perfil.curso?.nivel} />
              <Field label="Letra" value={busqueda.perfil.curso?.letra} />
              <Field label="Año" value={busqueda.perfil.curso?.anio} />
              <Field label="Profesor jefe" value={busqueda.perfil.curso?.profesorJefeRut} />
            </InfoCard>

            <InfoCard title={`Asistencias registradas (${busqueda.perfil.asistencias?.length || 0})`}>
              {busqueda.perfil.asistencias?.length ? (
                <ul className="list">
                  {busqueda.perfil.asistencias.map((item) => (
                    <li key={item.id}>
                      <Badge tone={item.estado}>{item.estado}</Badge>
                      <Field label="ID asistencia" value={item.id} />
                      <Field label="Fecha" value={item.fecha} />
                      <Field label="Observacion" value={item.observacion || 'Sin observacion'} />
                      <Field label="Registrada por" value={item.registradaPor} />
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
    </RoleGuard>
  )
}

export default AsistenciaDetalle
