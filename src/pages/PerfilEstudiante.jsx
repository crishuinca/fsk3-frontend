import Badge from '../components/Badge'
import BusquedaPerfilForm from '../components/BusquedaPerfilForm'
import Field from '../components/Field'
import InfoCard from '../components/InfoCard'
import RoleGuard from '../components/RoleGuard'
import { usePerfilEstudianteBusqueda } from '../hooks/usePerfilEstudianteBusqueda'
import { useRole } from '../hooks/useRole'

function PerfilEstudiante() {
  const { currentRole } = useRole()
  const busqueda = usePerfilEstudianteBusqueda()

  return (
    <section className="page">
      <h1>Perfil de estudiante</h1>
      

      <BusquedaPerfilForm
        descripcion="Busca un estudiante y muestra sus datos junto con asistencias y anotaciones."
        botonLabel="Buscar perfil"
        onSubmit={busqueda.buscarPerfil}
        {...busqueda}
      />

      {busqueda.perfil && (
        <>
          <div className="summary-grid">
            <InfoCard title="Resumen">
              <div className="metric-row">
                <div><strong>{busqueda.perfil.anotaciones?.length || 0}</strong><span>Anotaciones</span></div>
                <div><strong>{busqueda.perfil.asistencias?.length || 0}</strong><span>Asistencias</span></div>
                <div><strong>{busqueda.perfil.asistencias?.filter((item) => item.estado === 'AUSENTE').length || 0}</strong><span>Ausencias</span></div>
              </div>
            </InfoCard>
          </div>

          <div className="grid">
            <InfoCard title="Datos del estudiante">
              <Field label="ID" value={busqueda.perfil.estudiante?.id} />
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

            <RoleGuard permission="canViewAnotacion">
              <InfoCard title="Anotaciones">
                {busqueda.perfil.anotaciones?.length ? (
                  <ul className="list">
                    {busqueda.perfil.anotaciones.map((item) => (
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
                {busqueda.perfil.asistencias?.length ? (
                  <ul className="list">
                    {busqueda.perfil.asistencias.map((item) => (
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
