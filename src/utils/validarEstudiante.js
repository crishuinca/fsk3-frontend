import { getPerfilEstudiante } from '../services/bffApi'

export async function verificarEstudianteExiste(estudianteId) {
  if (!estudianteId || Number(estudianteId) <= 0) {
    return 'Debe ingresar un ID de estudiante valido.'
  }

  try {
    const perfil = await getPerfilEstudiante(estudianteId)
    if (!perfil?.estudiante?.id) {
      return `No existe un estudiante registrado con el ID ${estudianteId}.`
    }
    return ''
  } catch (ex) {
    return ex.message || `No existe un estudiante registrado con el ID ${estudianteId}.`
  }
}
