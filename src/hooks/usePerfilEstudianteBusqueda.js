import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getPerfilEstudiante, getPerfilEstudiantePorRut } from '../services/bffApi'

export function usePerfilEstudianteBusqueda() {
  const { user, loading: authLoading } = useAuth()
  const esAlumno = user?.rol === 'ALUMNO'
  const estudianteIdVinculado = user?.estudianteId ?? null

  const [tipoBusqueda, setTipoBusqueda] = useState('id')
  const [estudianteId, setEstudianteId] = useState(esAlumno ? String(estudianteIdVinculado || '') : '1')
  const [rut, setRut] = useState('')
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const errorVinculoAlumno =
    !authLoading && esAlumno && !estudianteIdVinculado
      ? 'Su usuario alumno no tiene ID de estudiante vinculado. Cierre sesion y vuelva a entrar.'
      : ''

  const cargarPerfil = useCallback(async (idEstudiante) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPerfilEstudiante(idEstudiante)
      setPerfil(data)
    } catch (ex) {
      setPerfil(null)
      setError(ex.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading || !esAlumno || !estudianteIdVinculado) {
      return
    }

    const id = estudianteIdVinculado
    queueMicrotask(() => {
      cargarPerfil(id)
    })
  }, [authLoading, esAlumno, estudianteIdVinculado, cargarPerfil])

  function validarBusqueda() {
    if (esAlumno) {
      return estudianteIdVinculado ? '' : 'Su usuario no tiene un ID de estudiante vinculado.'
    }
    if (tipoBusqueda === 'rut' && !rut.trim()) {
      return 'Debe ingresar el RUT del estudiante.'
    }
    if (tipoBusqueda === 'id' && (!estudianteId || Number(estudianteId) <= 0)) {
      return 'Debe ingresar un ID de estudiante valido.'
    }
    return ''
  }

  async function buscarPerfil(event) {
    event?.preventDefault?.()
    setError('')

    const validationError = validarBusqueda()
    if (validationError) {
      setPerfil(null)
      setError(validationError)
      return
    }

    if (esAlumno) {
      await cargarPerfil(estudianteIdVinculado)
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

  return {
    esAlumno,
    estudianteIdVinculado,
    tipoBusqueda,
    setTipoBusqueda,
    estudianteId,
    setEstudianteId,
    rut,
    setRut,
    perfil: errorVinculoAlumno ? null : perfil,
    loading,
    error: errorVinculoAlumno || error,
    buscarPerfil,
    authLoading,
  }
}
