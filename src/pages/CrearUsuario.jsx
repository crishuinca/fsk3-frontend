import { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import RoleGuard from '../components/RoleGuard'
import { roles } from '../context/roleStore'
import { useAuth } from '../hooks/useAuth'
import { createUser, getProximoEstudianteId } from '../services/authApi'

const rolesCrear = roles.filter((item) => item.id !== 'ADMIN')

const datosEstudianteInicial = {
  cursoId: '1',
  rut: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
}

function CrearUsuario() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    nombreUsuario: '',
    email: '',
    password: '',
    rol: 'PROFESOR',
  })
  const [datosEstudiante, setDatosEstudiante] = useState(datosEstudianteInicial)
  const [proximoEstudianteId, setProximoEstudianteId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const esAlumno = form.rol === 'ALUMNO'

  useEffect(() => {
    if (!esAlumno || !token) {
      return
    }

    let cancelado = false

    async function cargarProximoId() {
      try {
        const id = await getProximoEstudianteId(token)
        if (!cancelado) {
          setProximoEstudianteId(id)
        }
      } catch {
        if (!cancelado) {
          setProximoEstudianteId(null)
        }
      }
    }

    cargarProximoId()
    return () => {
      cancelado = true
    }
  }, [esAlumno, token])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateEstudianteField(field, value) {
    setDatosEstudiante((current) => ({ ...current, [field]: value }))
  }

  function validarDatosEstudiante() {
    if (!datosEstudiante.rut.trim()) {
      return 'El RUT del estudiante es obligatorio.'
    }
    if (!datosEstudiante.nombres.trim()) {
      return 'Los nombres del estudiante son obligatorios.'
    }
    if (!datosEstudiante.apellidoPaterno.trim()) {
      return 'El apellido paterno es obligatorio.'
    }
    if (!datosEstudiante.apellidoMaterno.trim()) {
      return 'El apellido materno es obligatorio.'
    }
    if (!datosEstudiante.cursoId || Number(datosEstudiante.cursoId) <= 0) {
      return 'Debe indicar el ID del curso (por ejemplo 1).'
    }
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.nombreUsuario.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Complete todos los campos obligatorios.')
      return
    }

    if (esAlumno) {
      const estudianteError = validarDatosEstudiante()
      if (estudianteError) {
        setError(estudianteError)
        return
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        nombreUsuario: form.nombreUsuario.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: form.rol,
      }

      if (esAlumno) {
        payload.datosEstudiante = {
          cursoId: Number(datosEstudiante.cursoId),
          rut: datosEstudiante.rut.trim(),
          nombres: datosEstudiante.nombres.trim(),
          apellidoPaterno: datosEstudiante.apellidoPaterno.trim(),
          apellidoMaterno: datosEstudiante.apellidoMaterno.trim(),
          email: form.email.trim(),
          fechaNacimiento: datosEstudiante.fechaNacimiento || null,
        }
      }

      const usuario = await createUser(payload, token)
      const vinculo = usuario.estudianteId ? ` (estudiante ID ${usuario.estudianteId})` : ''
      setSuccess(`Usuario ${usuario.nombreUsuario} creado correctamente con rol ${usuario.rol}${vinculo}.`)
      setForm({ nombreUsuario: '', email: '', password: '', rol: 'PROFESOR' })
      setDatosEstudiante(datosEstudianteInicial)
      if (esAlumno && token) {
        const nuevoId = await getProximoEstudianteId(token)
        setProximoEstudianteId(nuevoId)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RoleGuard permission="canCreateUsers">
      <section className="page">
        <div className="hero-panel">
          <p className="eyebrow">Inspector</p>
          <h1>Crear usuario</h1>
          <p>Como inspector, registre nuevos usuarios y asigne el rol correspondiente segun minimo privilegio.</p>
        </div>

        <form className="data-form" onSubmit={handleSubmit}>
          <label>
            Nombre de usuario
            <input
              type="text"
              value={form.nombreUsuario}
              onChange={(event) => updateField('nombreUsuario', event.target.value)}
              placeholder="profesor1"
            />
          </label>

          <label>
            Correo electronico
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="profesor1@colegio.cl"
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimo 6 caracteres"
            />
          </label>

          <label>
            Rol
            <select value={form.rol} onChange={(event) => updateField('rol', event.target.value)}>
              {rolesCrear.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {esAlumno ? (
            <div className="estudiante-id-panel form-full">
              <p className="eyebrow">Ficha del estudiante</p>
              <h2>Datos academicos</h2>
              <p>
                Al crear un alumno se registra automaticamente en el sistema academico. El ID se
                asigna solo (autoincremental); el primero sera 1 si no hay estudiantes previos.
              </p>

              <label>
                ID estimado del estudiante
                <input
                  type="text"
                  readOnly
                  value={proximoEstudianteId ?? '...'}
                  aria-readonly="true"
                />
              </label>

              <label>
                ID curso
                <input
                  type="number"
                  min="1"
                  required
                  value={datosEstudiante.cursoId}
                  onChange={(event) => updateEstudianteField('cursoId', event.target.value)}
                  placeholder="1"
                />
              </label>

              <label>
                RUT
                <input
                  type="text"
                  required
                  value={datosEstudiante.rut}
                  onChange={(event) => updateEstudianteField('rut', event.target.value)}
                  placeholder="21345678-9"
                />
              </label>

              <label>
                Nombres
                <input
                  type="text"
                  required
                  value={datosEstudiante.nombres}
                  onChange={(event) => updateEstudianteField('nombres', event.target.value)}
                  placeholder="Maria"
                />
              </label>

              <label>
                Apellido paterno
                <input
                  type="text"
                  required
                  value={datosEstudiante.apellidoPaterno}
                  onChange={(event) => updateEstudianteField('apellidoPaterno', event.target.value)}
                />
              </label>

              <label>
                Apellido materno
                <input
                  type="text"
                  required
                  value={datosEstudiante.apellidoMaterno}
                  onChange={(event) => updateEstudianteField('apellidoMaterno', event.target.value)}
                />
              </label>

              <label>
                Fecha de nacimiento (opcional)
                <input
                  type="date"
                  value={datosEstudiante.fechaNacimiento}
                  onChange={(event) => updateEstudianteField('fechaNacimiento', event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {error ? <ErrorMessage message={error} /> : null}
          {success ? <p className="success-message form-full">{success}</p> : null}

          <button className="button form-full" type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Crear usuario'}
          </button>
        </form>
      </section>
    </RoleGuard>
  )
}

export default CrearUsuario
